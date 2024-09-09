import { Request, Response } from 'express';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import { addTeacher, getTeachers } from '../modules/teacher';
import { getSubjectById } from '../modules/subject';
import inputTeacherSchema from './validationSchemas/teacherSchemas/inputTeacherSchema';
import { extractParameters } from '../shared/utils/queryParamsHelper';
import { TeacherSummaryResponseControllerDto, TeacherSummaryResponseControllerDtoHelper } from './dtos/response/teacherSummaryResponseControllerDto';

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
      const { filters, sortField, sortOrder, page, pageSize } = extractParameters(queryParams);
      const teachers = await getTeachers(filters, sortField, sortOrder, page, pageSize);
      
      let teachersSummary: TeacherSummaryResponseControllerDto[] = [];
      for (const teacher of teachers) {
        // add the associated subjects to the teacher
        let associatedSubjects = await Promise.all(teacher.subjects.map(async teacherSubject => (await getSubjectById(teacherSubject.subject_id)).name));
        teachersSummary.push(TeacherSummaryResponseControllerDtoHelper.fromModel(teacher, associatedSubjects))
      }
      res.status(200).json(teachersSummary);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new TeacherController();
