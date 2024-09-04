import * as yup from 'yup';
import { getTeacherRoles, TeacherRoles } from '../../../shared/utils/teacherRoles';

const inputTeacherPairsSchema = yup.object().shape({
    id_teacher_2: yup.number().required(),
    role_teacher_2: yup.mixed<TeacherRoles.TECHNOLOGY | TeacherRoles.THEORY>().oneOf(getTeacherRoles()).required(),
    start_date: yup.date().required(),
    end_date: yup.date().nullable()
});

export default inputTeacherPairsSchema;