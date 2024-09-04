import * as yup from 'yup';

const inputSubjectEventSchema = yup.object().shape({
    eventId: yup.number().required(),
    description: yup.string().required(),
});

export default inputSubjectEventSchema;