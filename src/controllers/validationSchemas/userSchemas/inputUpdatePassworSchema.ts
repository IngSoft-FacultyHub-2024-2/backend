import * as yup from 'yup';

const inputUpdatePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('La contraseña actual es requerida'),
  newPassword: yup.string().required('La nueva contraseña es requerida'),
});

export default inputUpdatePasswordSchema;
