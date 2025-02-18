import { Request, Response } from 'express';
import fs from 'fs';
import {
  addLecture,
  addSemester,
  deleteLecture,
  deleteSemester,
  getAssignedLecturesCsv,
  getSemesterLectures,
  getSemesterLecturesGroups,
  getSemesters,
  LectureResponseDto,
  submitTeacherReview,
  updateLecture,
  updateSemester,
} from '../modules/semester';
import { getRoleById } from '../modules/userManagement';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import inputLectureSchema from './validationSchemas/lectureSchemas/inputLectureSchema';
import inputSemesterSchema from './validationSchemas/semesterSchemas/inputSemesterSchema';
import inputTeacherReviewLectureSchema from './validationSchemas/semesterSchemas/inputTeacherReviewLectureSchema';

class SemesterController {
  async addSemester(req: Request, res: Response) {
    try {
      await inputSemesterSchema.validate(req.body);
      const semester = await addSemester(req.body);
      res.status(201).json(semester);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updateSemester(req: Request, res: Response) {
    try {
      await inputSemesterSchema.validate(req.body);
      const semester = await updateSemester(parseInt(req.params.id), req.body);
      res.status(201).json(semester);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async deleteSemester(req: Request, res: Response) {
    try {
      const semester = await deleteSemester(parseInt(req.params.id));
      res.status(200).json(semester);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getSemesters(req: any, res: Response) {
    try {
      const semesters = await getSemesters();
      res.status(200).json(semesters);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async addLecture(req: Request, res: Response) {
    try {
      await inputLectureSchema.validate(req.body);
      const lecture = await addLecture(req.body);
      res.status(201).json(lecture);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getLectures(req: any, res: Response) {
    try {
      const role = await getRoleById(req.user.role);
      const semesterId = req.params.semesterId;
      const { degreeId, subjectId, group } = req.query;
      let semester: LectureResponseDto[];
      if (role?.name === 'teacher') {
        semester = await getSemesterLectures(
          semesterId,
          degreeId,
          subjectId,
          group,
          req.user.teacher_id
        );
      } else {
        semester = await getSemesterLectures(
          semesterId,
          degreeId,
          subjectId,
          group
        );
      }
      res.status(200).json(semester);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getLecturesGroups(req: any, res: Response) {
    try {
      const semesterId = req.params.semesterId;
      const { degreeId, subjectId } = req.query;
      const semester = await getSemesterLecturesGroups(semesterId, degreeId);
      res.status(200).json(semester);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updateLecture(req: Request, res: Response) {
    try {
      await inputLectureSchema.validate(req.body);
      const lecture = await updateLecture(parseInt(req.params.id), req.body);
      res.status(200).json(lecture);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async deleteLecture(req: Request, res: Response) {
    try {
      const lecture = await deleteLecture(parseInt(req.params.id));
      res.status(200).json(lecture);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getAssignedLecturesCsv(req: Request, res: Response) {
    try {
      const assignedTeacherFilePath = await getAssignedLecturesCsv(
        parseInt(req.params.semesterId)
      );
      if (!assignedTeacherFilePath) {
        return res.status(404).json({
          message: 'Hubo un problema al generar el archivo de assignación',
        });
      }
      res.download(
        assignedTeacherFilePath,
        'profesoresAsignados.csv',
        (err) => {
          if (err) {
            console.error('Error sending file:', err);
            res
              .status(500)
              .json({ message: 'Hubo un problema al enviar el archivo' });
          } else {
            fs.unlink(assignedTeacherFilePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error('Error deleting file:', unlinkErr);
              } else {
                console.log('File deleted successfully');
              }
            });
          }
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
<<<<<<< HEAD
=======

  async teacherReviewLecture(req: any, res: Response) {
    try {
      await inputTeacherReviewLectureSchema.validate(req.body);
      const lectureId = parseInt(req.params.lectureId);
      const teacherId = req.user.teacher_id;
      const { approved, reason } = req.body;
      const lecture = await submitTeacherReview(
        lectureId,
        teacherId,
        approved,
        reason
      );
      res.status(200).json(lecture);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
>>>>>>> 72da67e815e80e05685c66cfd6994749c5350bf3
}

export default new SemesterController();
