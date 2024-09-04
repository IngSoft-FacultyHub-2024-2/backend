import * as yup from 'yup';

const inputNeedSchema = yup.object().shape({
    name: yup.string().required(),
});

export default inputNeedSchema;