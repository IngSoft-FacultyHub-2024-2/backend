import * as yup from 'yup';
import inputHourConfigSchema from './inputHourConfigSchema';
import inputNeedSchema from './inputNeedSchema';
import inputSubjectEventSchema from './inputSubjectEventSchema';

const inputSubjectSchema = yup.object().shape({
    name: yup.string().required(),
    subject_code: yup.string().required(),
    study_plan_year: yup.number().integer().positive().required(),
    associated_teacher: yup.number().required(),
    associated_coordinator: yup.number().integer().positive().nullable(),
    index: yup.number().positive().required(),
    frontal_hours: yup.number().positive().nullable(),
    intro_folder: yup.string().nullable(),
    subject_folder: yup.string().nullable(),
    technologies: yup.string().nullable(),
    notes: yup.string().nullable(),
    valid: yup.boolean().required().default(true),
    hour_configs:  yup.array().of(inputHourConfigSchema).nullable(),
    needs: yup.array().of(inputNeedSchema).nullable(),
    events: yup.array().of(inputSubjectEventSchema).nullable(),
});
  
export default inputSubjectSchema;