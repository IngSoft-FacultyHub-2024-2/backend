import { Op, Order } from "sequelize";
import sequelize from "../../../config/database";
import { ResourceNotFound } from "../../../shared/utils/exceptions/customExceptions";
import { TeacherStates } from "../../../shared/utils/teacherStates";
import Benefit from "./models/Benefit";
import CaesCourse from "./models/CaesCourse";
import Category from "./models/Category";
import Contact from "./models/Contact";
import Prize from "./models/Prize";
import Teacher from "./models/Teacher";
import TeacherAvailableModule from "./models/TeacherAvailableModules";
import TeacherBenefit from "./models/TeacherBenefit";
import TeacherCategory from "./models/TeacherCategory";
import TeacherSubjectGroup from "./models/TeacherSubjectGroup";
import TeacherSubjectGroupMember from "./models/TeacherSubjectGroupMember";
import TeacherSubjectHistory from "./models/TeacherSubjectHistory";
import TeacherSubjectOfInterest from "./models/TeacherSubjectOfInterest";

class TeacherRepository {
  async addTeacher(teacher: Partial<Teacher>) {
    const transaction = await sequelize.transaction();
    try {
      // Extraer subjects_of_interest y otros datos del teacherData
      const { subjects_of_interest = [], teacher_subject_groups = [] } = teacher;

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
        ],
        transaction,
      });

      if (subjects_of_interest.length > 0) {
        await this.associateSubjectsOfInterest(newTeacher.id, subjects_of_interest, transaction);
      }

      if (teacher_subject_groups.length > 0) {
        await this.associateTeacherSubjectGroups(newTeacher.id, teacher_subject_groups, transaction);
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

  private async associateSubjectsOfInterest(teacherId: number, subject_ids: any[], transaction: any) {
    const subjectAssociations = subject_ids.map(subject_id => ({
      subject_id: subject_id,
      teacher_id: teacherId,
    }));
    await TeacherSubjectOfInterest.bulkCreate(subjectAssociations, { transaction });
  }

  private async associateTeacherSubjectGroups(teacherId: number, teacherSubjectGroups: any[], transaction: any) {
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

      await TeacherSubjectGroupMember.create(
        newTeacherAssociation,
        { transaction }
      );

      const teacherRoles = teachers.map((teacher: any) => ({
        teacher_id: teacher.teacher_id,
        teacher_subject_group_id: newTeacherSubjectGroup.id,
        role: teacher.role,
      }));

      await TeacherSubjectGroupMember.bulkCreate(teacherRoles, { transaction });
    }
  }

  async getTeachers(
    limit: number,
    offset: number,
    sortOrder: string,
    withDeleted: boolean = false,
    sortField?: string,
    search?: string,
    state?: TeacherStates,
  ) {
    const orderOption = sortField ? [[sortField, sortOrder]] as Order : [['id', sortOrder]] as Order;
    const searchQuery = search
      ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { surname: { [Op.iLike]: `%${search}%` } },
          sequelize.where(sequelize.cast(sequelize.col('employee_number'), 'varchar'), { [Op.iLike]: `%${search}%` }),
        ],
      }
      : {};

    const stateQuery = state ? { state } : {};

    const whereClause = {
      ...searchQuery,
      ...stateQuery,
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
        { model: TeacherSubjectHistory, as: 'subjects_history' },
        { model: TeacherCategory, as: 'categories' },
        { model: TeacherBenefit, as: 'benefits' },
        { model: TeacherAvailableModule, as: 'teacher_available_modules' },
        { model: TeacherSubjectGroup, as: 'teacher_subject_groups', include: [{ model: TeacherSubjectGroupMember, as: 'members' }] },
        { model: TeacherSubjectOfInterest, as: 'subjects_of_interest' },
      ],
    });
  }

  async getTeacherById(id: number) {
    return await Teacher.findByPk(id, {
      paranoid: false,
      include: [
        { model: CaesCourse, as: 'caes_courses' },
        { model: Contact, as: 'contacts' },
        { model: Prize, as: 'prizes' },
        { model: TeacherSubjectHistory, as: 'subjects_history' },
        { model: TeacherCategory, as: 'categories' },
        { model: TeacherBenefit, as: 'benefits' },
        { model: TeacherAvailableModule, as: 'teacher_available_modules' },
        { model: TeacherSubjectGroup, as: 'teacher_subject_groups' },
        { model: TeacherSubjectOfInterest, as: 'subjects_of_interest' },
      ],
    });
  }

  async getAllTeachersNames() {
    return await Teacher.findAll({attributes: ['id', 'name', 'surname'],  order: [['surname', 'ASC']]});
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
      console.log(`Se eliminaron ${deletedTeacherCount} registros de profesores`);
  
      // Confirmar la transacción
      await transaction.commit();
    } catch (error) {
      // Si algo sale mal, revertir la transacción
      await transaction.rollback();
      throw error; // Propagar el error para que el controlador o el manejador de errores lo gestione
    }
  }

  temporaryDismissTeacher(id: number, retentionDate: Date) {
    Teacher.update({ state: TeacherStates.TEMPORARY_LEAVE, retentionDate }, { where: { id } });
  }

  async deleteTeacherSubjectGroups(id: number) {

    const groupsWhereIsMember = await TeacherSubjectGroupMember.findAll({ where: { teacher_id: id } });
    if (groupsWhereIsMember.length === 0) {
      return;
    }
    const groupIds: number[] = groupsWhereIsMember.map(group => group.teacher_subject_group_id);
    if (groupIds.length === 0) {
      return;
    }

    // Eliminar asociaciones del docente con los grupos
    await TeacherSubjectGroupMember.destroy({ where: { teacher_subject_group_id: groupIds } });

    // Eliminar grupos donde el docente es miembro
    await TeacherSubjectGroup.destroy({ where: { id: groupIds } });

  }

  async updateTeacher(teacherId: number, teacherData: Partial<Teacher>) {
    const transaction = await sequelize.transaction();
    try {
      // Extraer subjects_of_interest y otros datos del teacherData
      const { subjects_of_interest = [], teacher_subject_groups = [] } = teacherData;
  
      // Actualizar el Teacher y sus asociaciones directas
      const [updatedTeacher] = await Teacher.update(teacherData, {
        where: { id: teacherId },
        paranoid: false,
        returning: true, // Para obtener el registro actualizado
        transaction,
      });
  
      // Si no se encontró el teacher, lanzar un error
      if (!updatedTeacher) {
        throw new ResourceNotFound(`Teacher with id ${teacherId} not found`);
      }
  
      // Actualizar las asociaciones
      // Suponiendo que tienes métodos para manejar las asociaciones
      await this.associateSubjectsOfInterest(teacherId, subjects_of_interest, transaction);
      await this.associateTeacherSubjectGroups(teacherId, teacher_subject_groups, transaction);
  
      // Confirmar la transacción
      await transaction.commit();
  
      return this.getTeacherById(teacherId);
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar un docente:', error);
  
      // Realizar un rollback en caso de error
      await transaction.rollback();
      throw error;
    }
  }
  

  async getAllCategories() {
    return await Category.findAll();
  }

  async getAllBenefits() {
    return await Benefit.findAll();
  }
}

export default new TeacherRepository();
