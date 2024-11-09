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
    return await Semester.findAll();
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
          required: true,
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

    return semester;
  }
}

export default new SemesterRepository();
