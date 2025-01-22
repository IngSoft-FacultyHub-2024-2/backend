import * as yup from 'yup';

const inputUserSchema = yup.object().shape({
  teacherId: yup.number().required('El docente vinculado es requerido'),
  password: yup.string().required('La contraseña es requerida'),
  roleId: yup.number().required('El rol es requerido'),
});

export default inputUserSchema;
