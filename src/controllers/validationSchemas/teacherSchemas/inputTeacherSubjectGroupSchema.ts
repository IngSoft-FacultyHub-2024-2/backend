import * as yup from 'yup';
import { getTeacherRoles, TeacherRoles } from '../../../shared/utils/teacherRoles';
import inputTeacherRoleSchema from './inputTeacherRoleSchema';

const inputTeacherSubjectGroupSchema = yup.object().shape({
    subject_id: yup.number().required(),
    own_role: yup.mixed<TeacherRoles.TECHNOLOGY | TeacherRoles.THEORY>().oneOf(getTeacherRoles()).required(),
    teachers: yup.array().of(inputTeacherRoleSchema).required(),
});

export default inputTeacherSubjectGroupSchema;