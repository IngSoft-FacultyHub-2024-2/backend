import * as yup from 'yup';

const inputSemesterSchema = yup.object().shape({
    name: yup.string().required('El nombre del semestre es requerido'),
    start_date: yup.date().required('La fecha de inicio es requerida'),
    end_date: yup.date().required('La fecha de fin es requerida'),
});

export default inputSemesterSchema;