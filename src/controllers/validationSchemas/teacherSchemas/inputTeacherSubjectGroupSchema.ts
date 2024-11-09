import * as yup from 'yup';
import {
  getSubjectRoles,
  SubjectRoles,
} from '../../../shared/utils/enums/subjectRoles';
import inputTeacherRoleSchema from './inputTeacherRoleSchema';

const inputTeacherSubjectGroupSchema = yup.object().shape({
  subject_id: yup.number().required(),
  own_role: yup
    .mixed<SubjectRoles.TECHNOLOGY | SubjectRoles.THEORY>()
    .oneOf(getSubjectRoles())
    .required('El rol del profesor es requerido'),
  teachers: yup
    .array()
    .of(inputTeacherRoleSchema)
    .required('Los profesores son requeridos'),
});

export default inputTeacherSubjectGroupSchema;
