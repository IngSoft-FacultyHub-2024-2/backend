import * as yup from 'yup';

const inputTemporaryDismissSchema = yup.object().shape({
  //check if date is graten than today
  retentionDate: yup
    .date()
    .required('La fecha de retención es obligatoria')
    .min(
      new Date(),
      'El día de retención tiene que ser posterior al día de hoy'
    ),
  dismissMotive: yup
    .string()
    .required('El motivo de la retención es obligatorio'),
});

export default inputTemporaryDismissSchema;
