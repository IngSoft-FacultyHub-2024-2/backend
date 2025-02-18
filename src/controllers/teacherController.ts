import { Request, Response } from 'express';
import fs from 'fs';
import {
  addTeacher,
  dismissTeacher,
  getAllTeachersNames,
  getTeacherById,
  getTeachers,
  temporaryDismissTeacher,
  updateTeacher,
} from '../modules/teacher';
import {
  getTeachersContacts,
  rehireTeacher,
} from '../modules/teacher/services/teacherService';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import inputTeacherSchema from './validationSchemas/teacherSchemas/inputTeacherSchema';
import inputTemporaryDismissSchema from './validationSchemas/teacherSchemas/inputTemporaryDismissSchema';

class TeacherController {
  async addTeacher(req: Request, res: Response) {
    try {
      await inputTeacherSchema.validate(req.body);
      const teacher = await addTeacher(req.body);
      res.status(201).json(teacher);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getTeacherById(req: Request, res: Response) {
    try {
      const teacherId = parseInt(req.params.id);
      const teacher = await getTeacherById(teacherId, true);
      res.status(200).json(teacher);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async dismissTeacher(req: Request, res: Response) {
    try {
      const teacherId = parseInt(req.params.id);
      await dismissTeacher(teacherId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async rehireTeacher(req: Request, res: Response) {
    try {
      const teacherId = parseInt(req.params.id);
      await rehireTeacher(teacherId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async temporaryDismissTeacher(req: Request, res: Response) {
    try {
      await inputTemporaryDismissSchema.validate(req.body);
      const teacherId = parseInt(req.params.id);
      const retentionDate = req.body.retentionDate;
      temporaryDismissTeacher(teacherId, retentionDate);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getTeachersContacts(req: any, res: Response) {
    try {
      const { search, state, unsubscribe_risk, subject_id } = req.query;

      const teachersContactsFilePath = await getTeachersContacts(
        search,
        state,
        unsubscribe_risk,
        subject_id
      );

      if (!teachersContactsFilePath) {
        return res
          .status(404)
          .json({ message: 'Hubo un problema al generar el archivo' });
      }

      res.download(teachersContactsFilePath, 'contactos.csv', (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res
            .status(500)
            .json({ message: 'Hubo un problema al enviar el archivo' });
        } else {
          fs.unlink(teachersContactsFilePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting file:', unlinkErr);
            } else {
              console.log('File deleted successfully');
            }
          });
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getTeachers(req: any, res: Response) {
    try {
      const {
        search,
        state,
        unsubscribe_risk,
        subject_id,
        sortField,
        sortOrder,
        withDeleted,
        page,
        pageSize,
      } = req.query;
      console.log(subject_id);
      const teachersResponse = await getTeachers(
        search,
        state,
        unsubscribe_risk,
        subject_id,
        sortField,
        sortOrder,
        page,
        pageSize,
        withDeleted
      );
      res.status(200).json(teachersResponse);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getAllTeachersNames(req: Request, res: Response) {
    try {
      const teachers = await getAllTeachersNames();
      res.status(200).json(teachers);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updateTeacher(req: Request, res: Response) {
    try {
      const teacherId = parseInt(req.params.id);
      await inputTeacherSchema.validate(req.body);
      const teacher = await updateTeacher(teacherId, req.body);
      res.status(200).json(teacher);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new TeacherController();
