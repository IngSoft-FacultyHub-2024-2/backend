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
    .required(),
  total_hours: yup.number().positive().required(),
});

export default inputHourConfigSchema;
