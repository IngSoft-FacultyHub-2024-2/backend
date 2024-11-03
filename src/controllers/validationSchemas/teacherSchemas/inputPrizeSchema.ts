import * as yup from 'yup';

const inputPrizeSchema = yup.object().shape({
    name: yup.string().required("El nombre del premio es requerido"),
    year: yup.date().required("El año del premio es requerido"),
});

export default inputPrizeSchema;