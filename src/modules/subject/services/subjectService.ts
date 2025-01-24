import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';
import { getTeacherById } from '../../teacher';
import {
  SubjectRequestDto,
  SubjectRequestDtoHelper,
} from '../dtos/request/subjectRequestDto';
import {
  SubjectResponseDto,
  SubjectResponseDtoHelper,
} from '../dtos/response/subjectResponseDto';
import Subject from '../repositories/models/Subject';
import subjectRepository from '../repositories/subjectRepository';

export async function addSubject(subjectDto: SubjectRequestDto) {
  const subject: Partial<Subject> = SubjectRequestDtoHelper.toModel(subjectDto);
  let coordinator = await getTeacherById(subjectDto.associated_coordinator);
  const newSubject = await subjectRepository.addSubject(subject);
  return SubjectResponseDtoHelper.fromModel(newSubject, coordinator);
}

export async function getSubjects(
  filters?: Partial<Subject>,
  search?: string,
  sortField?: string,
  sortOrder?: 'ASC' | 'DESC',
  page: number = 1,
  pageSize: number = 10,
  withDeleted?: boolean
) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const subjectRows = await subjectRepository.getSubjects(
    limit,
    offset,
    sortOrder,
    withDeleted,
    search,
    filters,
    sortField
  );

  const totalPages = Math.ceil(subjectRows.count / pageSize);
  const subjects = subjectRows.rows;

  let subjectsDto: SubjectResponseDto[] = [];
  for (const subject of subjects) {
    let coordinator = await getTeacherById(subject.associated_coordinator);
    subjectsDto.push(SubjectResponseDtoHelper.fromModel(subject, coordinator));
  }

  return { subjects: subjectsDto, totalPages, currentPage: page };
}

export async function getSubjectById(
  id: number,
  includeOtherInfo: boolean = false
) {
  const subject = await subjectRepository.getSubjectById(id);
  if (!subject) {
    throw new ResourceNotFound(`La Materia con ID ${id} no existe`);
  }
  if (!includeOtherInfo) {
    return SubjectResponseDtoHelper.fromModel(subject);
  }
  let coordinator = await getTeacherById(subject.associated_coordinator);
  return SubjectResponseDtoHelper.fromModel(subject, coordinator);
}

export async function getAllSubjectNames() {
  const subjects = await subjectRepository.getAllSubjectNames();
  return subjects;
}

export async function updateSubject(id: number, subjectDto: SubjectRequestDto) {
  const subject: Partial<Subject> = SubjectRequestDtoHelper.toModel(subjectDto);
  let coordinator = await getTeacherById(subjectDto.associated_coordinator);
  const updatedSubject = await subjectRepository.updateSubject(id, subject);
  if (!updatedSubject) {
    throw new ResourceNotFound(
      `Materia con id ${id} no existe, por lo cual no se puede actualizar`
    );
  }
  return SubjectResponseDtoHelper.fromModel(updatedSubject, coordinator);
}

export async function teacherCoordinatorSubjects(id: number) {
  const coordinatorSubjects = await Subject.findAll({
    where: { associated_coordinator: id },
  });
  return coordinatorSubjects;
}

export async function deleteSubject(id: number) {
  const deletedSubject = await subjectRepository.deleteSubject(id);
  if (!deletedSubject) {
    throw new ResourceNotFound(`La Materia con ID ${id} no existe`);
  }
  return deletedSubject;
}

export async function amountOfTeachersPerSubject() {
  const amountOfTeachersPerSubject =
    await subjectRepository.amountOfTeachersPerSubject();
  return amountOfTeachersPerSubject;
}

export async function getSubjectsIdsWithTecTeoAtSameTime() {
  const subjectsIds =
    await subjectRepository.getSubjectsIdsWithTecTeoAtSameTime();
  return subjectsIds;
}

export async function getSubjectNamesByStudyPlan(studyPlanId: number) {
  const subjects =
    await subjectRepository.getSubjectNamesByStudyPlan(studyPlanId);
  return subjects;
}
