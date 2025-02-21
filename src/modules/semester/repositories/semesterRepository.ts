import { Op, Sequelize, Transaction } from 'sequelize';
import { SubjectRoles } from '../../../shared/utils/enums/subjectRoles';
import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';
import StudyPlan from '../../subject/repositories/models/StudyPlan';
import { TeacherResponseDto } from '../../teacher';
import TeacherAvailableModule from '../../teacher/repositories/models/TeacherAvailableModules';
import Lecture from './models/Lecture';
import LectureGroup from './models/LectureGroup';
import LectureHourConfig from './models/LectureHourConfig';
import LectureRole from './models/LectureRole';
import LectureTeacher from './models/LectureTeacher';
import Semester from './models/Semester';
import { getSubjectById } from '../../subject';

class SemesterRepository {
  async addSemster(semester: Partial<Semester>) {
    return await Semester.create(semester);
  }

  async deleteSemester(semesterId: number) {
    const semester = await Semester.findByPk(semesterId, {
      include: [
        {
          model: Lecture,
          as: 'lectures',
        },
      ],
    });

    if (!semester) {
      throw new ResourceNotFound(`Semester with ID ${semesterId} not found`);
    }

    for (const lecture of semester.lectures || []) {
      await this.deleteLecture(lecture.id);
    }

    return await Semester.destroy({
      where: { id: semesterId },
    });
  }

  async updateSemester(semesterId: number, semesterData: Partial<Semester>) {
    const semester = await Semester.findByPk(semesterId);

    if (!semester) {
      throw new ResourceNotFound(`Semester with ID ${semesterId} not found`);
    }

    return await semester.update(semesterData);
  }

  async getSemesters(teacherId?: number) {
    console.log('teacherId:', teacherId);
    const whereClause = teacherId
      ? {
          id: {
            [Op.in]: Sequelize.literal(`
              (SELECT DISTINCT "Lectures"."semester_id"
              FROM "Lectures"
              INNER JOIN "LectureRoles" ON "Lectures"."id" = "LectureRoles"."lecture_id"
              INNER JOIN "LectureTeachers" ON "LectureRoles"."id" = "LectureTeachers"."lecture_role_id"
              WHERE "LectureTeachers"."teacher_id" = ${teacherId})
            `),
          },
        }
      : {};

    return await Semester.findAll({
      order: [['start_date', 'DESC']],
      where: whereClause,
      attributes: {
        include: [
          [
            Sequelize.literal(
              `(SELECT COUNT(*) FROM "Lectures" WHERE "Lectures"."semester_id" = "Semester"."id")`
            ),
            'lectures_count',
          ],
        ],
      },
      include: [
        {
          model: StudyPlan,
          as: 'study_plan',
        },
      ],
    });
  }

  async getSemesterById(semesterId: number) {
    return await Semester.findByPk(semesterId);
  }

  async addLecture(lecture: Partial<Lecture>, applyValidation = true) {
    const transaction: Transaction = await Lecture.sequelize!.transaction();
    try {
      if (applyValidation) {
        await this.checkAmountOfHoursOfLectureCorrect(lecture);
      }
      const newLecture = await Lecture.create(lecture, {
        include: [
          {
            model: Semester,
            as: 'semester',
          },
          {
            model: LectureGroup,
            as: 'lecture_groups',
          },
          {
            model: LectureRole,
            as: 'lecture_roles',
            include: [
              {
                model: LectureHourConfig,
                as: 'hour_configs',
              },
              {
                model: LectureTeacher,
                as: 'teachers',
                required: false,
              },
            ],
          },
        ],
        transaction, // Ensure the creation is part of the transaction
      });

      // Commit the transaction if all operations succeed
      await transaction.commit();
      return newLecture;
    } catch (error) {
      // Roll back the transaction if any operation fails
      await transaction.rollback();
      throw error;
    }
  }

  async checkAmountOfHoursOfLectureCorrect(lecture: Partial<Lecture>) {
    if (!lecture.subject_id) {
      throw new Error('Seleccionar la materia es requerido');
    }
    const subject = await getSubjectById(lecture.subject_id);
    const amountOfWeeksInSemester = 16;
    if (!subject) {
      throw new ResourceNotFound(
        `Subject with ID ${lecture.subject_id} not found`
      );
    }
    const weeklyHours = Math.floor(
      subject.frontal_hours / amountOfWeeksInSemester
    );
    const lectureHours = lecture.lecture_roles?.reduce(
      (acc_role, role) =>
        acc_role +
        role.hour_configs.reduce((acc, config) => {
          return acc + config.modules.length;
        }, 0),
      0
    );
    if (!lectureHours || lectureHours !== weeklyHours) {
      throw new Error(
        `La materia ${subject.name} tiene ${weeklyHours} horas semanales y a este dictado se estan asignando ${lectureHours} horas`
      );
    }
  }

  async getSemesterLectures(
    semesterId: number,
    degreeId?: number,
    subjectId?: number,
    group?: string,
    teacherId?: number
  ) {
    const groupWhere = group ? { group } : {};
    const degreeWhere = degreeId ? { degree_id: degreeId } : {};
    const subjectWhere = subjectId ? { subject_id: subjectId } : {};

    const semester = await Semester.findByPk(semesterId, {
      include: [
        {
          model: Lecture,
          as: 'lectures',
          required: false,
          where: {
            ...subjectWhere,
          },
          include: [
            {
              model: LectureGroup,
              as: 'lecture_groups',
              where: {
                ...groupWhere,
                ...degreeWhere,
              },
            },
            {
              model: LectureRole,
              as: 'lecture_roles',
              include: [
                {
                  model: LectureHourConfig,
                  as: 'hour_configs',
                },
                {
                  model: LectureTeacher,
                  as: 'teachers',
                },
              ],
            },
          ],
        },
      ],
    });

    if (semester && teacherId) {
      semester.lectures = semester.lectures.filter((lecture: any) =>
        lecture.lecture_roles.some((role: any) =>
          role.teachers.some((teacher: any) => teacher.teacher_id === teacherId)
        )
      );
    }

    semester?.lectures.forEach((lecture: Lecture) => {
      lecture.lecture_roles = lecture.lecture_roles.map((role: any) =>
        role.get({ plain: true })
      );
    });

    return semester;
  }

  async getSemesterLecturesGroups(semesterId: number, degreeId?: number) {
    const degreeWhere = degreeId ? { degree_id: degreeId } : {};
    const distinctGroups = await LectureGroup.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('group')), 'group']], // Select distinct 'group'
      where: {
        ...degreeWhere,
      },
      include: [
        {
          model: Lecture,
          as: 'lecture',
          where: { semester_id: semesterId },
          attributes: [],
        },
      ],
      raw: true,
      order: [['group', 'ASC']],
    });
    return distinctGroups.map((row: any) => row.group);
  }

  async updateLecture(
    lectureId: number,
    lectureData: Partial<Lecture>,
    teachers: TeacherResponseDto[]
  ) {
    await this.checkAmountOfHoursOfLectureCorrect(lectureData);
    const transaction: Transaction = await Lecture.sequelize!.transaction();

    try {
      const lecture = await Lecture.findByPk(lectureId, {
        include: [
          { model: LectureGroup, as: 'lecture_groups' },
          {
            model: LectureRole,
            as: 'lecture_roles',
            include: ['hour_configs', 'teachers'],
          },
        ],
        transaction, // Ensure all queries in the transaction scope
      });

      if (!lecture) {
        throw new Error(`Lecture with ID ${lectureId} not found`);
      }

      // Update the main Lecture attributes
      if (lectureData) {
        await lecture.update(lectureData, { transaction });
      }

      // Update LectureGroups
      if (lectureData.lecture_groups) {
        // Remove existing groups
        await LectureGroup.destroy({
          where: { lecture_id: lectureId },
          transaction,
        });

        // Add new groups
        const newGroups = lectureData.lecture_groups.map((group) => ({
          lecture_id: lectureId,
          degree_id: group.degree_id,
          group: group.group,
        }));
        await LectureGroup.bulkCreate(newGroups, { transaction });
      }

      let lockingAction = false;
      // Update LectureRoles
      if (lectureData.lecture_roles) {
        // Fetch all existing lecture role IDs for cleanup
        const existingRoles = await LectureRole.findAll({
          where: { lecture_id: lectureId },
          transaction,
        });
        const roleIds = existingRoles.map((role) => role.id);

        // Delete associated LectureHourConfig and LectureTeacher records
        await LectureHourConfig.destroy({
          where: { lecture_role_id: roleIds },
          transaction,
        });

        await LectureTeacher.destroy({
          where: { lecture_role_id: roleIds },
          transaction,
        });

        // Delete all existing LectureRoles
        await LectureRole.destroy({
          where: { lecture_id: lectureId },
          transaction,
        });

        // Create new roles
        for (const lectureRole of lectureData.lecture_roles) {
          lockingAction = lectureRole.is_lecture_locked;

          const newRole = await LectureRole.create(
            { ...lectureRole, lecture_id: lectureId },
            { transaction }
          );

          // Create nested hour_configs
          if (lectureRole.hour_configs) {
            const newHourConfigs = lectureRole.hour_configs.map((config) => ({
              lecture_role_id: newRole.id,
              day_of_week: config.day_of_week,
              modules: config.modules,
            }));
            await LectureHourConfig.bulkCreate(newHourConfigs, { transaction });
          }

          // Create nested teachers
          if (lectureRole.teachers) {
            const newTeachers = lectureRole.teachers.map((teacher) => ({
              lecture_role_id: newRole.id,
              teacher_id: teacher.teacher_id,
              is_technology_teacher: teacher.is_technology_teacher,
              reason: null,
            }));
            await LectureTeacher.bulkCreate(newTeachers, { transaction });
          }
          if (lockingAction) {
            console.log('lockingAction:', lockingAction, lectureRole.role);
            await this.validateLockedLectures(
              teachers,
              lecture,
              lectureRole.role
            );
          }
        }
      }

      // Commit transaction
      await transaction.commit();

      // Return updated lecture
      return await Lecture.findByPk(lectureId, {
        include: [
          { model: LectureGroup, as: 'lecture_groups' },
          {
            model: LectureRole,
            as: 'lecture_roles',
            include: ['hour_configs', 'teachers'],
          },
        ],
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async setTeacherToLecture(
    lectureId: number,
    teacherId: number,
    role: string,
    is_technology_teacher: boolean
  ) {
    const lectureRole = await LectureRole.findOne({
      where: { lecture_id: lectureId, role },
    });

    if (!lectureRole) {
      throw new ResourceNotFound(
        `Lecture role not found for lecture ${lectureId}`
      );
    }

    return await LectureTeacher.create({
      lecture_role_id: lectureRole.id,
      teacher_id: teacherId,
      role,
      is_technology_teacher,
    });
  }

  async validateLockedLectures(
    teachers: TeacherResponseDto[],
    updateLectureData: Lecture,
    role: string
  ) {
    const lectureRole = updateLectureData.lecture_roles.find(
      (lectureRole) => lectureRole.role === role
    );
    // 0. Validate if a teacher was assigned to the locked lecture
    if (!lectureRole || lectureRole.teachers.length === 0) {
      throw new Error('No se puede lockear un dictado sin profesores.');
    }
    // see if teacher is twice in the same lecture
    const teacherIds = lectureRole.teachers.map(
      (teacher) => teacher.teacher_id
    );
    if (teacherIds.length !== new Set(teacherIds).size) {
      throw new Error(
        'No se puede lockear un dictado con profesores repetidos.'
      );
    }

    for (const teacher of teachers) {
      // 1. Validate if the teacher has available hours
      const availableModules = teacher.teacher_available_modules;
      if (!this.matchesLectureTime(availableModules, lectureRole, teacher.id)) {
        throw new Error(
          `Docente ${teacher.name} ${teacher.surname} no tiene horas disponibles para dar este dictado.`
        );
      }

      // 2. Validate if the teacher has taught the subject before
      const subjectHistory = teacher.subjects_history || [];
      let roleHeIsAssigned = lectureRole.role;
      if (this.isRoleTechnologyForThatTeacher(teacher, updateLectureData)) {
        roleHeIsAssigned = SubjectRoles.TECHNOLOGY;
      }
      if (
        !subjectHistory.some(
          (history) =>
            history.subject_id == updateLectureData.subject_id &&
            history.role == roleHeIsAssigned
        )
      ) {
        throw new Error(
          `Docente ${teacher.name} ${teacher.surname} no ha dictado la materia y rol antes.`
        );
      }

      // 3. Validate if the teacher is already assigned to another lecture at the same time
      const otherLectures = await Lecture.findAll({
        include: [
          { model: LectureGroup, as: 'lecture_groups' },
          {
            model: LectureRole,
            as: 'lecture_roles',
            include: ['hour_configs', 'teachers'],
          },
        ],
        where: {
          id: { [Op.ne]: updateLectureData.id },
        },
      });
      //console.log('otherLectures:', JSON.stringify(otherLectures, null, 2));
      if (this.isAlreadyAssignedTeacher(otherLectures, updateLectureData)) {
        throw new Error(
          `Docente ${teacher.name} ${teacher.surname} ya está asignado a otro dictado en el mismo horario.`
        );
      }
    }
  }

  isAlreadyAssignedTeacher(
    otherLectures: Lecture[],
    updateLectureData: Partial<Lecture>
  ): boolean {
    const toBeAssignedLectureRoles = updateLectureData.lecture_roles || [];
    const existingLectureRoles = otherLectures.flatMap(
      (lecture) => lecture.lecture_roles || []
    );

    for (const lectureRole of existingLectureRoles || []) {
      const existingTeachers = lectureRole.teachers || [];
      const existingHoursConfig = lectureRole.hour_configs || [];
      const isLocked = lectureRole.is_lecture_locked;
      if (isLocked) {
        for (const oneLectureRole of toBeAssignedLectureRoles) {
          const toBeAssignedTeachers = oneLectureRole.teachers || [];
          const toBeAssignedHoursConfig = oneLectureRole.hour_configs || [];

          for (const teacher of toBeAssignedTeachers) {
            // Verificar si el profesor está en el dictado existente
            const isSameTeacher = existingTeachers.some(
              (existingTeacher) =>
                existingTeacher.teacher_id == teacher.teacher_id
            );

            if (isSameTeacher) {
              // Verificar si hay conflicto de horarios
              for (const newHourConfig of toBeAssignedHoursConfig) {
                for (const existingHourConfig of existingHoursConfig) {
                  if (
                    newHourConfig.day_of_week ==
                      existingHourConfig.day_of_week &&
                    newHourConfig.modules.some((module) =>
                      existingHourConfig.modules.includes(module)
                    )
                  ) {
                    // Hay conflicto
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    }
    // No hay conflictos
    return false;
  }

  // Helper function to match lecture time
  matchesLectureTime(
    teacherHourConfig: TeacherAvailableModule[],
    lectureRole: LectureRole,
    teacherId: number
  ): boolean {
    let isMatch = true;

    if (
      !lectureRole.teachers?.find((teacher) => teacher.teacher_id == teacherId)
    ) {
      throw new Error(`Teacher ${teacherId} is not assigned to the lecture.`);
    }

    const lectureHoursConfig = lectureRole.hour_configs;

    if (lectureHoursConfig) {
      for (const config of lectureHoursConfig) {
        const leactureDayOfWeek = config.day_of_week;
        const leactureModules = config.modules;

        for (const lectureModuleId of leactureModules) {
          const isTeacherAvailable = teacherHourConfig.find(
            (row) =>
              row.day_of_week == leactureDayOfWeek &&
              row.module_id == lectureModuleId
          );

          if (!isTeacherAvailable) {
            isMatch = false;
            break;
          }
        }

        if (!isMatch) {
          break;
        }
      }
    }
    return isMatch;
  }

  async deleteTeachersAssignations(semesterId: number) {
    // TODO: filter out the locked lectures
    const semester = await Semester.findByPk(semesterId, {
      include: [
        {
          model: Lecture,
          as: 'lectures',
          include: [
            {
              model: LectureRole,
              as: 'lecture_roles',
              include: [
                {
                  model: LectureTeacher,
                  as: 'teachers',
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!semester) {
      throw new ResourceNotFound(`Semester with ID ${semesterId} not found.`);
    }

    const lectureTeacherIds: number[] = [];
    for (const lecture of semester.lectures || []) {
      for (const lectureRole of lecture.lecture_roles || []) {
        for (const teacher of lectureRole.teachers || []) {
          lectureTeacherIds.push(teacher.id);
        }
      }
    }

    if (lectureTeacherIds.length > 0) {
      await LectureTeacher.destroy({
        where: {
          id: lectureTeacherIds,
        },
      });
    } else {
      console.log('No LectureTeacher entries found for the given semester.');
    }
  }

  async deleteLecture(lectureId: number): Promise<void> {
    const lecture = await Lecture.findByPk(lectureId, {
      include: [
        { association: Lecture.associations.lecture_groups },
        { association: Lecture.associations.lecture_roles },
      ],
    });

    if (!lecture) {
      throw new Error(`Lecture with ID ${lectureId} not found`);
    }

    const transaction = await Lecture.sequelize!.transaction();

    try {
      // Delete associated lecture groups
      if (lecture.lecture_groups && lecture.lecture_groups.length > 0) {
        await LectureGroup.destroy({
          where: { lecture_id: lectureId },
          transaction,
        });
      }

      // Delete associated lecture roles
      if (lecture.lecture_roles && lecture.lecture_roles.length > 0) {
        const existingRoles = await LectureRole.findAll({
          where: { lecture_id: lectureId },
          transaction,
        });
        const roleIds = existingRoles.map((role) => role.id);

        await LectureHourConfig.destroy({
          where: { lecture_role_id: roleIds },
          transaction,
        });

        await LectureTeacher.destroy({
          where: { lecture_role_id: roleIds },
          transaction,
        });

        await LectureRole.destroy({
          where: { lecture_id: lectureId },
          transaction,
        });
      }

      // Delete the lecture itself
      await Lecture.destroy({
        where: { id: lectureId },
        transaction,
      });

      // Commit the transaction
      await transaction.commit();
    } catch (error) {
      // Rollback the transaction in case of any error
      await transaction.rollback();
      throw error;
    }
  }

  isRoleTechnologyForThatTeacher(
    teacher: TeacherResponseDto,
    updateLectureData: Lecture
  ) {
    if (
      updateLectureData.lecture_roles.find((role) =>
        role.teachers.find(
          (t) => t.teacher_id == teacher.id && t.is_technology_teacher
        )
      )
    ) {
      return true;
    }
    return false;
  }

  async submitTeacherReview(
    lectureId: number,
    teacherId: number,
    review: string | null
  ) {
    const lecture = await Lecture.findOne({
      where: { id: lectureId },
      include: [
        {
          model: LectureRole,
          as: 'lecture_roles',
          include: [
            {
              model: LectureTeacher,
              as: 'teachers',
              where: { teacher_id: teacherId },
            },
          ],
        },
      ],
    });

    if (!lecture) {
      throw new ResourceNotFound('El dictado no existe.');
    }

    const lectureTeacher =
      lecture.lecture_roles.length > 0 &&
      lecture.lecture_roles[0].teachers &&
      lecture.lecture_roles[0].teachers[0];

    if (!lectureTeacher) {
      throw new ResourceNotFound(
        `El docente no está asignado al dictado seleccionado.`
      );
    }

    return await lectureTeacher.update({ review: review });
  }
}

export default new SemesterRepository();
