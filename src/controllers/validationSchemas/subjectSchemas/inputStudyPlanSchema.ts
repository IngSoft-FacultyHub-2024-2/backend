import * as yup from 'yup';

const inputSubjectStudyPlanSchema = yup.object().shape({
    year: yup.number().required(),
});

export default inputSubjectStudyPlanSchema;