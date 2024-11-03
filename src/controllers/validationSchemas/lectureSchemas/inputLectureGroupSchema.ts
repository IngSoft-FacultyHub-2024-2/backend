import * as yup from 'yup';

const inputLectureGroupSchema = yup.object().shape({
    degree_id: yup.number().required('La carrera es requerida'),
    group: yup.string().required('El nombre del grupo es requerido'),
});

export default inputLectureGroupSchema;