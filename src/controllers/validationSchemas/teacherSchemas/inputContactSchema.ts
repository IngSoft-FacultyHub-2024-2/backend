import * as yup from 'yup';

const inputContactSchema = yup.object().shape({
  mean: yup.string().required('El medio de contacto es requerido'),
  data: yup.string().when('mean', {
    is: (mean: string) => mean.toLowerCase() === 'mail',
    then: (schema) => schema.email('El correo debe ser válido'),
    otherwise: (schema) =>
      schema.required('La información de contacto es requerida'),
  }),
  prefered: yup.boolean().required('Preference is required'),
});
export default inputContactSchema;
