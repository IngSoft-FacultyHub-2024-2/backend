import * as yup from 'yup';

const inputSubjectEventSchema = yup.object().shape({
    event_id: yup.number().required(),
    description: yup.string().required(),
});

export default inputSubjectEventSchema;