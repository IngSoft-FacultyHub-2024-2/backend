import * as yup from 'yup';

const inputSubjectEventSchema = yup.object().shape({
  event_id: yup.number().required('El id del evento es obligatorio'),
  description: yup
    .string()
    .required('La descripción del evento es obligatoria'),
});

export default inputSubjectEventSchema;
