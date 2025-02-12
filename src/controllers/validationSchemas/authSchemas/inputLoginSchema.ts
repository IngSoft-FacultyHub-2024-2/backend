import * as yup from 'yup';

const inputLoginSchema = yup.object().shape({
  teacher_employee_number: yup
    .number()
    .required('El número de empleado es requerido para iniciar sesión'),
  password: yup
    .string()
    .required('La contraseña es requerida para iniciar sesión'),
});

export default inputLoginSchema;
