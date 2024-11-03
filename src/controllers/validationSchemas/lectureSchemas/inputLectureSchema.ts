import * as yup from 'yup';
import inputLectureGroupSchema from './inputLectureGroupSchema';
import inputLectureRoleSchema from './inputLectureRoleSchema';

const inputLectureSchema = yup.object().shape({
    semester_id: yup.number().required('El semestre es requerido'),
    subject_id: yup.number().required('La materia es obligatoria'),
    lecture_groups: yup.array().of(inputLectureGroupSchema).required('Por lo menos un grupo es requerido'),
    lecture_roles: yup.array().of(inputLectureRoleSchema).required('Por lo menos una modalidad de clase es requerida'),
});

export default inputLectureSchema;