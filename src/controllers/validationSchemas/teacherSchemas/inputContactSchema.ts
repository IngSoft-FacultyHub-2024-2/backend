import * as yup from 'yup';

const inputContactSchema = yup.object().shape({
    mean: yup.string().required("El medio de contacto es requerido"),
    data: yup.string().required("La información de contacto es requerida"),
    prefered: yup.boolean().required("Preference is required"),
});

export default inputContactSchema;