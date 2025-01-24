import * as yup from 'yup';

const inputUpdatePasswordSchema = yup.object().shape({
  old_password: yup.string().required('La contraseña actual es requerida'),
  new_password: yup.string().required('La nueva contraseña es requerida'),
});

export default inputUpdatePasswordSchema;
