import * as yup from 'yup';
import {
  getSubjectRoles,
  SubjectRoles,
} from '../../../shared/utils/enums/subjectRoles';
import inputLectureConfigHourSchema from './inputLectureConfigHourSchema';

const inputLectureRoleSchema = yup.object().shape({
  role: yup
    .mixed<SubjectRoles.TECHNOLOGY | SubjectRoles.THEORY>()
    .oneOf(getSubjectRoles(), 'El rol debe ser Teórico o Tecnología')
    .required('El rol es requerido'),
  hour_configs: yup
    .array()
    .of(inputLectureConfigHourSchema)
    .required('Al menos una configuración de horas es requerida'),
});

export default inputLectureRoleSchema;
