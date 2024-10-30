import * as yup from 'yup';
import { getTeacherRoles, TeacherRoles } from '../../../shared/utils/enums/teacherRoles';

// TODO: role options should come from a table
const inputHourConfigSchema = yup.object().shape({
    role: yup.mixed<TeacherRoles.TECHNOLOGY | TeacherRoles.THEORY>().oneOf(getTeacherRoles()).required(),
    total_hours: yup.number().positive().required(),
});

export default inputHourConfigSchema;