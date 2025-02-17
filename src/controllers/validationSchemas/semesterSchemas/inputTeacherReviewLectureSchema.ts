import * as yup from 'yup';

const inputTeacherReviewLectureSchema = yup.object().shape({
  approved: yup.boolean().required('El campo aprobado es requerido'),
  reason: yup.string().nullable(),
});

export default inputTeacherReviewLectureSchema;
