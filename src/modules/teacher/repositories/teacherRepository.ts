import fs from 'fs';
import path from 'path';
import { Op, Order, Transaction } from 'sequelize';
import sequelize from '../../../config/database';
import { TeacherStates } from '../../../shared/utils/enums/teacherStates';
import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';
import CaesCourse from './models/CaesCourse';
import Contact from './models/Contact';
import Prize from './models/Prize';
import Teacher from './models/Teacher';
import TeacherAvailableModule from './models/TeacherAvailableModules';
import TeacherBenefit from './models/TeacherBenefit';
import TeacherCategory from './models/TeacherCategory';
import TeacherSubjectGroup from './models/TeacherSubjectGroup';
import TeacherSubjectGroupMember from './models/TeacherSubjectGroupMember';
import TeacherSubjectHistory from './models/TeacherSubjectHistory';
import TeacherSubjectOfInterest from './models/TeacherSubjectOfInterest';

class TeacherRepository {
  async addTeacher(teacher: Partial<Teacher>) {
    const transaction = await sequelize.transaction();
    try {
      // Extraer subjects_of_interest y otros datos del teacherData
      const { teacher_subject_groups = [] } = teacher;

      // Crear el Teacher y sus asociaciones directas
      const newTeacher = await Teacher.create(teacher, {
        include: [
          { model: CaesCourse, as: 'caes_courses' },
          { model: Contact, as: 'contacts' },
          { model: Prize, as: 'prizes' },
          { model: TeacherSubjectHistory, as: 'subjects_history' },
          { model: TeacherCategory, as: 'categories' },
          { model: TeacherBenefit, as: 'benefits' },
          { model: TeacherAvailableModule, as: 'teacher_available_modules' },
          { model: TeacherSubjectOfInterest, as: 'subjects_of_interest' },
        ],
        transaction,
      });

      if (teacher_subject_groups.length > 0) {
        await this.associateTeacherSubjectGroups(
          newTeacher.id,
          teacher_subject_groups,
          transaction
        );
      }

      // Confirmar la transacción
      await transaction.commit();

      return newTeacher;
    } catch (error) {
      console.error('Ha ocurrido un error al agregar un docente:', error);

      // Realizar un rollback en caso de error
      await transaction.rollback();
      throw error;
    }
  }

  private async associateSubjectsOfInterest(
    teacherId: number,
    subject_ids: any[],
    transaction: any
  ) {
    const subjectAssociations = subject_ids.map((subject_id) => ({
      subject_id: subject_id,
      teacher_id: teacherId,
    }));
    await TeacherSubjectOfInterest.bulkCreate(subjectAssociations, {
      transaction,
    });
  }

  private async associateTeacherSubjectGroups(
    teacherId: number,
    teacherSubjectGroups: any[],
    transaction: Transaction
  ) {
    for (const teacherSubjectGroup of teacherSubjectGroups) {
      const { subject_id, teachers, own_role } = teacherSubjectGroup;
      const newTeacherSubjectGroup = await TeacherSubjectGroup.create(
        { subject_id },
        { transaction }
      );

      const newTeacherAssociation = {
        teacher_id: teacherId,
        teacher_subject_group_id: newTeacherSubjectGroup.id,
        role: own_role,
      };

      const teacherRoles = teachers.map((teacher: any) => ({
        teacher_id: teacher.teacher_id,
        teacher_subject_group_id: newTeacherSubjectGroup.id,
        role: teacher.role,
      }));

      teacherRoles.push(newTeacherAssociation);

      await TeacherSubjectGroupMember.bulkCreate(teacherRoles, { transaction });
    }
  }

  async getTeachersContacts(
    search?: string,
    state?: TeacherStates,
    risk?: number,
    subject_id?: number
  ) {
    const searchQuery = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { surname: { [Op.iLike]: `%${search}%` } },
            sequelize.where(
              sequelize.cast(sequelize.col('employee_number'), 'varchar'),
              { [Op.iLike]: `%${search}%` }
            ),
          ],
        }
      : {};

    const stateQuery = state ? { state } : {};
    const riskQuery = risk ? { unsubscribe_risk: risk } : {};

    const subjectInclude = subject_id
      ? {
          model: TeacherSubjectHistory,
          as: 'subjects_history',
          where: { subject_id },
          required: true,
        }
      : { model: TeacherSubjectHistory, as: 'subjects_history' };

    const whereClause = {
      ...searchQuery,
      ...stateQuery,
      ...riskQuery,
    };

    const teachers = await Teacher.findAll({
      where: whereClause,
      include: [{ model: Contact, as: 'contacts' }, subjectInclude],
    });

    const contactsFilePath = await this.generateContactsCsv(teachers);

    return contactsFilePath;
  }

  generateContactsCsv = async (teachers: Teacher[]) => {
    try {
      const contacts = teachers
        .flatMap((teacher) => {
          if (teacher.contacts) {
            // Get all emails
            return teacher.contacts
              .filter((contact) => contact.mean === 'Mail')
              .map((contact) => contact.data);
          }
        })
        .filter((contact): contact is string => Boolean(contact));

      // Convertir los contactos en formato CSV
      const csvRows = ['Contactos'];
      contacts.forEach((contact) => {
        csvRows.push(contact); // Añadir cada contacto como una fila
      });

      const csvString = csvRows.join('\n');

      // Escribir el archivo CSV
      const date = new Date().toISOString().replace(/:/g, '-');
      const filePath = `./contacts-${date}.csv`;
      fs.writeFileSync(filePath, csvString, 'utf8');

      const absoluteFilePath = path.resolve(filePath);
      return absoluteFilePath;
    } catch (error) {
      console.error('Error generating contacts CSV file:', error);
    }
  };

  async getTeachers(
    limit: number,
    offset: number,
    sortOrder: string,
    withDeleted: boolean = false,
    sortField?: string,
    search?: string,
    state?: TeacherStates,
    risk?: number,
    subject_id?: number
  ) {
    const orderOption = sortField
      ? ([[sortField, sortOrder]] as Order)
      : ([['id', sortOrder]] as Order);
    const searchQuery = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { surname: { [Op.iLike]: `%${search}%` } },
            sequelize.where(
              sequelize.cast(sequelize.col('employee_number'), 'varchar'),
              { [Op.iLike]: `%${search}%` }
            ),
          ],
        }
      : {};

    const stateQuery = state ? { state } : {};
    const riskQuery = risk ? { unsubscribe_risk: risk } : {};
    const subjectQuery = subject_id ? { subject_id } : {};

    const whereClause = {
      ...searchQuery,
      ...stateQuery,
      ...riskQuery,
    };

    return await Teacher.findAndCountAll({
      where: whereClause,
      order: orderOption,
      limit,
      offset,
      paranoid: withDeleted,
      distinct: true,
      include: [
        { model: CaesCourse, as: 'caes_courses' },
        { model: Contact, as: 'contacts' },
        { model: Prize, as: 'prizes' },
        {
          model: TeacherSubjectHistory,
          as: 'subjects_history',
          required: !!subject_id,
          where: subjectQuery,
        },
        { model: TeacherCategory, as: 'categories' },
        { model: TeacherBenefit, as: 'benefits' },
        { model: TeacherAvailableModule, as: 'teacher_available_modules' },
        {
          model: TeacherSubjectGroup,
          as: 'teacher_subject_groups',
          include: [{ model: TeacherSubjectGroupMember, as: 'members' }],
        },
        { model: TeacherSubjectOfInterest, as: 'subjects_of_interest' },
      ],
    });
  }

  async getTeacherById(id: number) {
    const teacher = await Teacher.findByPk(id, {
      paranoid: false,
      include: [
        { model: CaesCourse, as: 'caes_courses' },
        { model: Contact, as: 'contacts' },
        { model: Prize, as: 'prizes' },
        { model: TeacherSubjectHistory, as: 'subjects_history' },
        { model: TeacherCategory, as: 'categories' },
        { model: TeacherBenefit, as: 'benefits' },
        { model: TeacherAvailableModule, as: 'teacher_available_modules' },
        {
          model: TeacherSubjectGroup,
          as: 'teacher_subject_groups',
          include: [{ model: TeacherSubjectGroupMember, as: 'members' }],
        },
        { model: TeacherSubjectOfInterest, as: 'subjects_of_interest' },
      ],
    });

    return teacher;
  }

  async getAllTeachersNames() {
    return await Teacher.findAll({
      attributes: ['id', 'name', 'surname'],
      order: [['surname', 'ASC']],
    });
  }

  async dismissTeacher(id: number) {
    const transaction = await sequelize.transaction();

    try {
      // Actualizar el estado del profesor a 'INACTIVE'
      await Teacher.update(
        { state: TeacherStates.INACTIVE },
        { where: { id }, transaction }
      );
      // Eliminar el registro del profesor
      const deletedTeacherCount = await Teacher.destroy({
        where: { id },
        transaction,
      });
      console.log(
        `Se eliminaron ${deletedTeacherCount} registros de profesores`
      );

      // Confirmar la transacción
      await transaction.commit();
    } catch (error) {
      // Si algo sale mal, revertir la transacción
      await transaction.rollback();
      throw error; // Propagar el error para que el controlador o el manejador de errores lo gestione
    }
  }

  temporaryDismissTeacher(id: number, retentionDate: Date) {
    Teacher.update(
      { state: TeacherStates.TEMPORARY_LEAVE, retentionDate },
      { where: { id } }
    );
  }

  async rehireTeacher(id: number) {
    await Teacher.update(
      { state: TeacherStates.ACTIVE, retentionDate: null, deletedAt: null },
      { where: { id }, paranoid: false }
    );
  }

  async deleteTeacherSubjectGroups(id: number) {
    const groupsWhereIsMember = await TeacherSubjectGroupMember.findAll({
      where: { teacher_id: id },
    });
    if (groupsWhereIsMember.length === 0) {
      return;
    }
    const groupIds: number[] = groupsWhereIsMember.map(
      (group) => group.teacher_subject_group_id
    );
    if (groupIds.length === 0) {
      return;
    }

    // Eliminar asociaciones del docente con los grupos
    await TeacherSubjectGroupMember.destroy({
      where: { teacher_subject_group_id: groupIds },
    });

    // Eliminar grupos donde el docente es miembro
    await TeacherSubjectGroup.destroy({ where: { id: groupIds } });
  }

  async updateTeacher(teacherId: number, teacherData: Partial<Teacher>) {
    const transaction = await sequelize.transaction();
    try {
      const [updatedTeacher] = await Teacher.update(teacherData, {
        where: { id: teacherId },
        paranoid: false,
        returning: true,
        transaction,
      });

      if (!updatedTeacher) {
        throw new ResourceNotFound(`Teacher with id ${teacherId} not found`);
      }

      //update associations
      await this.updateCaesCourse(teacherId, teacherData, transaction);
      await this.updateContacts(teacherId, teacherData, transaction);
      await this.updatePrizes(teacherId, teacherData, transaction);
      await this.updateSubjectsHistory(teacherId, teacherData, transaction);
      await this.updateCategories(teacherId, teacherData, transaction);
      await this.updateBenefits(teacherId, teacherData, transaction);
      await this.updateTeacherSubjectGroups(
        teacherId,
        teacherData,
        transaction
      );
      await this.updateSubjectsOfInterest(teacherId, teacherData, transaction);
      await this.updateTeacherAvailableModules(
        teacherId,
        teacherData,
        transaction
      );

      await transaction.commit();

      return this.getTeacherById(teacherId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async updateCaesCourse(
    teacherId: number,
    teacherData: Partial<Teacher>,
    transaction: Transaction
  ) {
    const { caes_courses = [] } = teacherData;
    await CaesCourse.destroy({ where: { teacher_id: teacherId }, transaction });
    if (caes_courses.length > 0) {
      const newCaesCourses = caes_courses.map((course) => ({
        ...course,
        teacher_id: teacherId,
      }));

      await CaesCourse.bulkCreate(newCaesCourses, { transaction });
    }
  }

  private async updateContacts(
    teacherId: number,
    teacherData: Partial<Teacher>,
    transaction: Transaction
  ) {
    const { contacts = [] } = teacherData;
    await Contact.destroy({ where: { teacher_id: teacherId }, transaction });
    if (contacts.length > 0) {
      const newContacts = contacts.map((contact) => ({
        ...contact,
        teacher_id: teacherId,
      }));

      await Contact.bulkCreate(newContacts, { transaction });
    }
  }

  private async updatePrizes(
    teacherId: number,
    teacherData: Partial<Teacher>,
    transaction: Transaction
  ) {
    const { prizes = [] } = teacherData;
    await Prize.destroy({ where: { teacher_id: teacherId }, transaction });
    if (prizes.length > 0) {
      const newPrizes = prizes.map((prize) => ({
        ...prize,
        teacher_id: teacherId,
      }));

      await Prize.bulkCreate(newPrizes, { transaction });
    }
  }

  private async updateSubjectsHistory(
    teacherId: number,
    teacherData: Partial<Teacher>,
    transaction: Transaction
  ) {
    const { subjects_history = [] } = teacherData;
    await TeacherSubjectHistory.destroy({
      where: { teacher_id: teacherId },
      transaction,
    });
    if (subjects_history.length > 0) {
      const newSubjectsHistory = subjects_history.map((subjectHistory) => ({
        ...subjectHistory,
        teacher_id: teacherId,
      }));

      await TeacherSubjectHistory.bulkCreate(newSubjectsHistory, {
        transaction,
      });
    }
  }

  private async updateCategories(
    teacherId: number,
    teacherData: Partial<Teacher>,
    transaction: Transaction
  ) {
    const { categories = [] } = teacherData;
    await TeacherCategory.destroy({
      where: { teacher_id: teacherId },
      transaction,
    });
    if (categories.length > 0) {
      const newCategories = categories.map((category) => ({
        ...category,
        teacher_id: teacherId,
      }));

      await TeacherCategory.bulkCreate(newCategories, { transaction });
    }
  }

  private async updateBenefits(
    teacherId: number,
    teacherData: Partial<Teacher>,
    transaction: Transaction
  ) {
    const { benefits = [] } = teacherData;
    await TeacherBenefit.destroy({
      where: { teacher_id: teacherId },
      transaction,
    });
    if (benefits.length > 0) {
      const newBenefits = benefits.map((benefit) => ({
        ...benefit,
        teacher_id: teacherId,
      }));

      await TeacherBenefit.bulkCreate(newBenefits, { transaction });
    }
  }

  private async updateTeacherSubjectGroups(
    teacherId: number,
    teacherData: Partial<Teacher>,
    transaction: Transaction
  ) {
    const { teacher_subject_groups = [] } = teacherData;
    if (teacher_subject_groups.length > 0) {
      const groups = await TeacherSubjectGroupMember.findAll({
        where: { teacher_id: teacherId },
        transaction,
      });
      const groupIds = groups.map((group) => group.teacher_subject_group_id);
      groupIds.forEach(async (groupId) => {
        await TeacherSubjectGroupMember.destroy({
          where: { teacher_subject_group_id: groupId },
          transaction,
        });
        await TeacherSubjectGroup.destroy({
          where: { id: groupId },
          transaction,
        });
      });

      await this.associateTeacherSubjectGroups(
        teacherId,
        teacher_subject_groups,
        transaction
      );
    }
  }

  private async updateSubjectsOfInterest(
    teacherId: number,
    teacherData: Partial<Teacher>,
    transaction: Transaction
  ) {
    const { subjects_of_interest = [] } = teacherData;
    await TeacherSubjectOfInterest.destroy({
      where: { teacher_id: teacherId },
      transaction,
    });
    if (subjects_of_interest.length > 0) {
      const newSubjectsOfInterest = subjects_of_interest.map(
        (subjectOfInterest) => ({
          ...subjectOfInterest,
          teacher_id: teacherId,
        })
      );

      await TeacherSubjectOfInterest.bulkCreate(newSubjectsOfInterest, {
        transaction,
      });
    }
  }

  private async updateTeacherAvailableModules(
    teacherId: number,
    teacherData: Partial<Teacher>,
    transaction: Transaction
  ) {
    const { teacher_available_modules = [] } = teacherData;
    await TeacherAvailableModule.destroy({
      where: { teacher_id: teacherId },
      transaction,
    });
    if (teacher_available_modules.length > 0) {
      const newTeacherAvailableModules = teacher_available_modules.map(
        (module) => ({
          ...module,
          teacher_id: teacherId,
        })
      );
      await TeacherAvailableModule.bulkCreate(newTeacherAvailableModules, {
        transaction,
      });
    }
  }

  async getTeachersToAssignLectures() {
    const teachers = await Teacher.findAll({
      where: { state: TeacherStates.ACTIVE },
      include: [
        {
          model: TeacherSubjectGroup,
          as: 'teacher_subject_groups',
          include: [{ model: TeacherSubjectGroupMember, as: 'members' }],
        },
        { model: TeacherAvailableModule, as: 'teacher_available_modules' },
        { model: TeacherSubjectHistory, as: 'subjects_history' },
      ],
    });
    return teachers;
  }

  async closeOpenSubjects(id: number) {
    await TeacherSubjectHistory.update(
      { end_date: new Date() },
      { where: { teacher_id: id, end_date: null }, paranoid: false }
    );
  }
}

export default new TeacherRepository();
