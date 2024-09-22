import * as yup from 'yup';
import inputHourConfigSchema from './inputHourConfigSchema';
import inputNeedSchema from './inputNeedSchema';
import inputSubjectEventSchema from './inputSubjectEventSchema';

const inputSubjectSchema = yup.object().shape({
    name: yup.string().required(),
    subject_code: yup.string().required(),
    acronym: yup.string().required(),
    study_plan_id: yup.number().integer().positive().required(),
    associated_coordinator: yup.number().integer().positive().required(),
    index: yup.number().positive().required(),
    frontal_hours: yup.number().positive().required(),
    intro_folder: yup.string().nullable(),
    subject_folder: yup.string().nullable(),
    technologies: yup.string().nullable(),
    notes: yup.string().nullable(),
    valid: yup.boolean().required().default(true),
    hour_configs:  yup.array().of(inputHourConfigSchema).required(),
    needs: yup.array().of(inputNeedSchema).nullable(),
    needs_notes: yup.string().nullable(),
    events: yup.array().of(inputSubjectEventSchema).nullable(),
}).test(
    'is-total-hours-correct',
    'index * frontal_hours must equal the sum of hour_configs.total_hours',
    function (value) {
        const { index, frontal_hours, hour_configs } = value;
        const sumOfHourConfigsTotalHours = hour_configs ? hour_configs.reduce((sum, config) => sum + config.total_hours, 0) : 0;
        return (index * frontal_hours) === sumOfHourConfigsTotalHours;
    }
);
  
export default inputSubjectSchema;