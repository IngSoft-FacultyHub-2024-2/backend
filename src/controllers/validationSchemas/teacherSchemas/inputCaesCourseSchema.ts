import * as yup from 'yup';

const inputCaesCourseSchema = yup.object().shape({
    name: yup.string().required("Course name is required"),
    date: yup.date().required("Course date is required"),
});

export default inputCaesCourseSchema;