import * as yup from 'yup';

const inputCaesCourseSchema = yup.object().shape({
    name: yup.string().required("El nombre del curso CAE es requerido"),
    date: yup.date().typeError('La fecha del curso CAE debe ser de tipo fecha').required("La fecha del curso CAE es requerida"),
});

export default inputCaesCourseSchema;