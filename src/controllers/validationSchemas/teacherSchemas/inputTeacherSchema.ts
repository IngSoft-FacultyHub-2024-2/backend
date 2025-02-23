import * as yup from 'yup';
import inputCaesCourseSchema from './inputCaesCourseSchema';
import inputContactSchema from './inputContactSchema';
import inputPrizeSchema from './inputPrizeSchema';
import subjectsHistorySchema from './inputSubjectSchema';
import inputTeacherAvailableModuleSchema from './inputTeacherAvailableModuleSchema';
import inputTeacherSubjectGroupSchema from './inputTeacherSubjectGroupSchema';

const inputTeacherSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  surname: yup.string().required('El apellido es requerido'),
  birth_date: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  employee_number: yup
    .number()
    .positive('El numero de funcionario debe contener solo números')
    .nullable(),
  cv_file: yup.string().nullable(),
  how_they_found_us: yup.string().nullable(),
  id_photo: yup.string().nullable(),
  hiring_date: yup.date().nullable(),
  linkedin_link: yup
    .string()
    .url('El link de LinkedIn debe ser una URL válida')
    .nullable(),
  graduated: yup.boolean().nullable(),
  notes: yup.string().nullable(),
  prizes: yup.array().of(inputPrizeSchema).nullable(),
  caes_courses: yup.array().of(inputCaesCourseSchema).nullable(),
  contacts: yup
    .array()
    .of(inputContactSchema)
    .test(
      'Por lo menos un contacto debe ser Email',
      'Por lo menos un contacto debe ser Email',
      (contacts) => contacts?.some((contact) => contact.mean === 'Mail')
    ),
  teacher_categories: yup
    .array()
    .of(
      yup.object().shape({
        category_id: yup
          .number()
          .required('El ID de la categoría es requerido'),
        date: yup.date().required('La fecha de la categoría es requerida'),
      })
    )
    .nullable(),
  benefits: yup
    .array()
    .of(
      yup.object().shape({
        benefit_id: yup.number().required('El ID del beneficio es requerido'),
        date: yup.date().required('La fecha del beneficio es requerida'),
      })
    )
    .nullable(),
  subjects_history: subjectsHistorySchema.nullable(),
  subjects_of_interest: yup
    .array()
    .of(
      yup.object().shape({
        subject_id: yup.number().required('El ID de la materia es requerido'),
      })
    )
    .nullable(),
  teacher_subject_groups: yup
    .array()
    .of(inputTeacherSubjectGroupSchema)
    .nullable(),
  teacher_available_modules: yup
    .array()
    .of(inputTeacherAvailableModuleSchema)
    .nullable(),
});

export default inputTeacherSchema;
