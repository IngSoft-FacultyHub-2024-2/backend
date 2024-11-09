import * as yup from 'yup';
import {
  getSubjectRoles,
  SubjectRoles,
} from '../../../shared/utils/enums/subjectRoles';

// TODO: role options should come from a table
const inputHourConfigSchema = yup.object().shape({
  role: yup
    .mixed<SubjectRoles.TECHNOLOGY | SubjectRoles.THEORY>()
    .oneOf(getSubjectRoles())
    .required('El formato de la configuración de horas es requerido'),
  total_hours: yup
    .number()
    .positive()
    .required('El total de horas es requerido'),
});

export default inputHourConfigSchema;
