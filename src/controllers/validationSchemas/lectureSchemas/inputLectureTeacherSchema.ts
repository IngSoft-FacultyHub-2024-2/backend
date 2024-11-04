import * as yup from 'yup';

const inputLectureTeacherSchema = yup.object().shape({
    teacher_id: yup.number().required("El profesor es requerido"),
});

export default inputLectureTeacherSchema;