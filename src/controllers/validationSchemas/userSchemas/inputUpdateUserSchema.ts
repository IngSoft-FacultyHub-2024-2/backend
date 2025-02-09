import * as yup from 'yup';

const inputUpdateUserSchema = yup.object().shape({
  password: yup.string().required('La contraseña es requerida'),
  role_id: yup.number().required('El rol es requerido'),
});

export default inputUpdateUserSchema;
