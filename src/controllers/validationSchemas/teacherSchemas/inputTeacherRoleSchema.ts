import * as yup from 'yup';
import { getTeacherRoles, TeacherRoles } from '../../../shared/utils/teacherRoles';

const inputTeacherRoleSchema = yup.object().shape({
    teacher_id: yup.number().required(),
    role: yup.mixed<TeacherRoles.TECHNOLOGY | TeacherRoles.THEORY>().oneOf(getTeacherRoles()).required(),
});

export default inputTeacherRoleSchema;