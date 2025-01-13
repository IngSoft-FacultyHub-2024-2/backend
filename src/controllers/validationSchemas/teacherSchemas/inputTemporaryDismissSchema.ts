import * as yup from 'yup';

const inputTemporaryDismissSchema = yup.object().shape({
  //check if date is graten than today
  retentionDate: yup
    .date()
    .required()
    .min(
      new Date(),
      'EL dia de retencion tiene que ser posterior al dia de hoy'
    ),
});

export default inputTemporaryDismissSchema;
