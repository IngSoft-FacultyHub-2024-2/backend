import * as yup from 'yup';

const inputDegreeSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    acronym: yup.string().required('Acronym is required'),
});

export default inputDegreeSchema;