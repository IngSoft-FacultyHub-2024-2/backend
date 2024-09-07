import * as yup from 'yup';
import inputPrizeSchema from './inputPrizeSchema';
import inputCaesCourseSchema from './inputCaesCourseSchema';
import inputContactSchema from './inputContactSchema';
import inputSubjectSchema from './inputSubjectSchema';

const inputTeacherSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    surname: yup.string().required("Surname is required"),
    birth_date: yup.date().nullable().transform((value, originalValue) => originalValue === "" ? null : value),
    employee_number: yup.number().positive().nullable(),
    cv_file: yup.string().nullable(),
    how_they_found_us: yup.string().nullable(),
    id_photo: yup.string().nullable(),
    hiring_date: yup.date().nullable(),
    contact_hours: yup.string().nullable(),
    linkedin_link: yup.string().url("LinkedIn link must be a valid URL").nullable(),
    graduated: yup.boolean().nullable(),
    notes: yup.string().nullable(),
    prizes: yup.array().of(inputPrizeSchema).nullable(),
    caes_courses: yup.array().of(inputCaesCourseSchema).nullable(),
    contacts: yup.array().of(inputContactSchema).nullable(),
    categories: yup.array().of(yup.number()).nullable(),
    benefits: yup.array().of(yup.number()).nullable(),
    subjects: yup.array().of(inputSubjectSchema).nullable(),
    subjects_of_interest: yup.array().of(yup.number()).nullable(),

});

export default inputTeacherSchema;