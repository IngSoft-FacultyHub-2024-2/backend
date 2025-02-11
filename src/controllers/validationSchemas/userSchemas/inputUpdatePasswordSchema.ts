import * as yup from 'yup';

const inputUpdatePasswordSchema = yup.object().shape({
  old_password: yup.string(),
  new_password: yup.string(),
});

export default inputUpdatePasswordSchema;
