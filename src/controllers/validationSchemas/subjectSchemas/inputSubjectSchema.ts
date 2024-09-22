import * as yup from 'yup';
import inputHourConfigSchema from './inputHourConfigSchema';
import inputNeedSchema from './inputNeedSchema';
import inputSubjectEventSchema from './inputSubjectEventSchema';

const inputSubjectSchema = yup.object().shape({
    name: yup.string().required('El nombre de la materia es obligatorio.'),
    subject_code: yup.string().required('El código de la materia es obligatorio.'),
    acronym: yup.string().required('El acrónimo de la materia es obligatorio.'),
    study_plan_id: yup.number().integer().positive().required('El plan de estudio es obligatorio.'),
    associated_coordinator: yup.number().integer().positive().required('El coordinador asociado es obligatorio.'),
    index: yup.number().positive().required('El índice de la materia es obligatorio y debe ser mayor que cero.'),
    frontal_hours: yup.number().positive().required('Las horas frontales son obligatorias y deben ser un valor positivo.'),
    intro_folder: yup.string().nullable(),
    subject_folder: yup.string().nullable(),
    technologies: yup.string().nullable(),
    notes: yup.string().nullable(),
    valid: yup.boolean().required().default(true),
    hour_configs:  yup.array().of(inputHourConfigSchema).required('La configuración de horas es obligatoria.'),
    needs: yup.array().of(inputNeedSchema).nullable(),
    needs_notes: yup.string().nullable(),
    events: yup.array().of(inputSubjectEventSchema).nullable('La materia debe tener al menos un evento'),
}).test(
    'is-total-hours-correct',
    'El producto de índice * horas frontales debe ser igual a la suma de horas totales de la configuración de horas.',
    function (value) {
        const { index, frontal_hours, hour_configs } = value;
        const sumOfHourConfigsTotalHours = hour_configs ? hour_configs.reduce((sum, config) => sum + config.total_hours, 0) : 0;
        return (index * frontal_hours) === sumOfHourConfigsTotalHours;
    }
);
  
export default inputSubjectSchema;