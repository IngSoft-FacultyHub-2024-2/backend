import * as yup from 'yup';

const inputTemporaryDismissSchema = yup.object().shape({
  //check if date is graten than today
  retentionDate: yup
    .date()
    .required()
    .min(
      new Date(),
      'El día de retención tiene que ser posterior al día de hoy'
    ),
  dismissMotive: yup.string().required(),
});

export default inputTemporaryDismissSchema;
