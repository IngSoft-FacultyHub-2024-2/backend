import { Request, Response } from 'express';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import { addTeacher, getTeachers } from '../modules/teacher';
import { getSubjectById } from '../modules/subject';
import inputTeacherSchema from './validationSchemas/teacherSchemas/inputTeacherSchema';
import { extractParameters } from '../shared/utils/queryParamsHelper';
import { getBenefits, getCategories } from '../modules/teacher/services/teacherService';
import { GetTeachersResponseDto, GetTeachersResponseDtoHelper } from './dtos/response/GetTeachersResponseDto';

class TeacherController {
  async addTeacher(req: Request, res: Response) {
    try{
      await inputTeacherSchema.validate(req.body)
      const teacher = await addTeacher(req.body);
      res.status(201).json(teacher);
    } catch (error) {
      console.log('error adding teacher:', error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getTeachers(req: Request, res: Response) {
    try {
      const queryParams = req.query;
      const { search, sortField, sortOrder, page, pageSize } = extractParameters(queryParams);
      const {teachers, totalPages, currentPage} = await getTeachers(search, sortField, sortOrder, page, pageSize);

      let teachersResponse: GetTeachersResponseDto = { teachers: [], totalPages, currentPage };
      for (const teacher of teachers) {
        // add the associated subjects to the teacher
        let associatedSubjects = await Promise.all(teacher.subjects_history.map(async teacherSubject => (await getSubjectById(teacherSubject.subject_id)).name));
        teachersResponse.teachers.push(GetTeachersResponseDtoHelper.fromModel(teacher, associatedSubjects))
      }
      res.status(200).json(teachersResponse);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getBenefits(req: Request, res: Response) {
    try {
      const benefits = await getBenefits();
      res.status(200).json(benefits);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await getCategories();
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}


export default new TeacherController();
