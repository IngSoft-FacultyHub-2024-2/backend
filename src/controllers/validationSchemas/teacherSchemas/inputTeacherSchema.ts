import * as yup from 'yup';
import inputPrizeSchema from './inputPrizeSchema';
import inputCaesCourseSchema from './inputCaesCourseSchema';
import inputContactSchema from './inputContactSchema';
import inputSubjectSchema from './inputSubjectSchema';
import inputTeacherSubjectGroupSchema from './inputTeacherSubjectGroupSchema';
import inputTeacherAvailableModuleSchema from './inputTeacherAvailableModuleSchema';

const inputTeacherSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    surname: yup.string().required("Surname is required"),
    birth_date: yup.date().nullable().transform((value, originalValue) => originalValue === "" ? null : value),
    employee_number: yup.number().positive().nullable(),
    cv_file: yup.string().nullable(),
    how_they_found_us: yup.string().nullable(),
    id_photo: yup.string().nullable(),
    hiring_date: yup.date().nullable(),
    linkedin_link: yup.string().url("LinkedIn link must be a valid URL").nullable(),
    graduated: yup.boolean().nullable(),
    notes: yup.string().nullable(),
    prizes: yup.array().of(inputPrizeSchema).nullable(),
    caes_courses: yup.array().of(inputCaesCourseSchema).nullable(),
    contacts: yup.array().of(inputContactSchema).nullable(),
    teacher_categories: yup.array().of(
        yup.object().shape({
            category_id: yup.number().required("Category ID is required"),
        })
    ).nullable(),
    benefits: yup.array().of(
        yup.object().shape({
            benefit_id: yup.number().required("Benefit ID is required"),
        })
    ).nullable(),
    subjects_history: yup.array().of(inputSubjectSchema).nullable(),
    subjects_of_interest: yup.array().of(yup.number()).nullable(),
    teacher_subject_groups: yup.array().of(inputTeacherSubjectGroupSchema).nullable(),
    teacher_available_modules: yup.array().of(inputTeacherAvailableModuleSchema).nullable(),
});

export default inputTeacherSchema;