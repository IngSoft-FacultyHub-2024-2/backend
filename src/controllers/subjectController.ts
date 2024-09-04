import { Request, Response } from 'express';
import { addSubject, getSubjects } from '../modules/subject';
import { getTeacherById } from '../modules/teacher';
import inputSubjectSchema from './validationSchemas/subjectSchemas/inputSubjectSchema';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import { extractParameters } from '../shared/utils/queryParamsHelper';
import { SubjectSummaryResponseControllerDto, SubjectSummaryResponseControllerDtoHelper } from './dtos/response/subjectSummaryResponseControllerDto';

class SubjectController {
  async addSubject(req: Request, res: Response) {
    try{
      await inputSubjectSchema.validate(req.body)
      const subject = await addSubject(req.body);
      res.status(201).json(subject);
    } catch (error) {
      console.log('error adding subject:', error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getSubjects(req: Request, res: Response) {
    try {
      const queryParams = req.query;
      const { filters, sortField, sortOrder, page, pageSize } = extractParameters(queryParams);
      const subjects = await getSubjects(filters, sortField, sortOrder, page, pageSize);
      
      let subjectsWithCoordinator: SubjectSummaryResponseControllerDto[] = [];
      for (const subject of subjects) {
        let associated_coordinator: any = await getTeacherById(subject.associated_coordinator);
        console.log(associated_coordinator)
        let subject_with_coordinator = SubjectSummaryResponseControllerDtoHelper.fromModel(subject, associated_coordinator.name + " " + associated_coordinator.surname); 
        subjectsWithCoordinator.push(subject_with_coordinator)
      }
      // TODO: convert to DTO
      res.status(200).json(subjectsWithCoordinator);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new SubjectController();
