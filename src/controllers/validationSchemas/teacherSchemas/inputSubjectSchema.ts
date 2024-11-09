import * as yup from 'yup';
import {
  getSubjectRoles,
  SubjectRoles,
} from '../../../shared/utils/enums/subjectRoles';

const inputSubjectSchema = yup.object().shape({
  subject_id: yup.number().required('El id de la materia es requerido'),
  role: yup
    .mixed<SubjectRoles.TECHNOLOGY | SubjectRoles.THEORY>()
    .oneOf(getSubjectRoles(), 'El rol debe ser Teoría o Tecnología')
    .required('Role is required'),
  start_date: yup.date().required('La fecha de inicio es requerida'),
  end_date: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
});

export default inputSubjectSchema;
