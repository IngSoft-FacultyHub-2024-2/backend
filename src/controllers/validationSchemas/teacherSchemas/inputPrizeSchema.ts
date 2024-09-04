import * as yup from 'yup';

const inputPrizeSchema = yup.object().shape({
    name: yup.string().required("Prize name is required"),
    year: yup.date().required("Year is required"),
});

export default inputPrizeSchema;