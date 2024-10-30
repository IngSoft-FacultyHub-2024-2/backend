import * as yup from 'yup';
import {
  getSubjectRoles,
  SubjectRoles,
} from '../../../shared/utils/enums/subjectRoles';

const inputTeacherRoleSchema = yup.object().shape({
  teacher_id: yup.number().required(),
  role: yup
    .mixed<SubjectRoles.TECHNOLOGY | SubjectRoles.THEORY>()
    .oneOf(getSubjectRoles())
    .required(),
});

export default inputTeacherRoleSchema;
