import * as yup from 'yup';

const inputDegreeSchema = yup.object().shape({
  name: yup.string().required('El campo nombre es requerido'),
  acronym: yup.string().required('El campo acrónimo es requerido'),
});

export default inputDegreeSchema;
