import { Sequelize, Transaction } from 'sequelize';
import Lecture from './models/Lecture';
import LectureGroup from './models/LectureGroup';
import LectureHourConfig from './models/LectureHourConfig';
import LectureRole from './models/LectureRole';
import LectureTeacher from './models/LectureTeacher';
import Semester from './models/Semester';

class SemesterRepository {
  async addSemster(semester: Partial<Semester>) {
    return await Semester.create(semester);
  }

  async getSemesters() {
    return await Semester.findAll({
      order: [['start_date', 'DESC']],
    });
  }

  async addLecture(lecture: Partial<Lecture>) {
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
    });

    return newLecture;
  }

  async getSemesterLectures(
    semesterId: number,
    degreeId?: number,
    subjectId?: number,
    group?: string
  ) {
    // const groupWhere has group and degreeId
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
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    });

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

  async updateLecture(lectureId: number, lectureData: Partial<Lecture>) {
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
            }));
            await LectureTeacher.bulkCreate(newTeachers, { transaction });
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
}

export default new SemesterRepository();
