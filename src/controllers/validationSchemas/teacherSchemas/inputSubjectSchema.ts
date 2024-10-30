import * as yup from 'yup';
import {
  getSubjectRoles,
  SubjectRoles,
} from '../../../shared/utils/enums/subjectRoles';

const inputSubjectSchema = yup.object().shape({
  subject_id: yup.number().required('Subject Id is required'),
  role: yup
    .mixed<SubjectRoles.TECHNOLOGY | SubjectRoles.THEORY>()
    .oneOf(getSubjectRoles(), 'Role must be one of the allowed values')
    .required('Role is required'),
  start_date: yup.date().required('Start date is required'),
  end_date: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
});

export default inputSubjectSchema;
