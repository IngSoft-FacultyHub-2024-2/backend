import * as yup from 'yup';

const inputEventSchema = yup.object().shape({
    title: yup.string().required(),
});

export default inputEventSchema;