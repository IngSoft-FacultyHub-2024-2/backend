import * as yup from 'yup';
import {
  getSubjectRoles,
  SubjectRoles,
} from '../../../shared/utils/enums/subjectRoles';

const inputTeacherRoleSchema = yup.object().shape({
  teacher_id: yup.number().required('El id del profesor es requerido'),
  role: yup
    .mixed<SubjectRoles.TECHNOLOGY | SubjectRoles.THEORY>()
    .oneOf(getSubjectRoles())
    .required('El rol del profesor es requerido'),
});

export default inputTeacherRoleSchema;
