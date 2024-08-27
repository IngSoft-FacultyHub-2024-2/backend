import * as yup from 'yup';

// TODO: role options should come from a table
const inputHourConfigSchema = yup.object().shape({
    role: yup.mixed<'Teorico' | 'Tecnología'>().oneOf(['Teorico', 'Tecnología']).required(),
    total_hours: yup.number().positive().required(),
    weekly_hours: yup.number().positive().required(),
});

export default inputHourConfigSchema;