import * as yup from 'yup';
import {
  getSubjectRoles,
  SubjectRoles,
} from '../../../shared/utils/enums/subjectRoles';

const inputSubjectSchema = yup.object().shape({
  subject_id: yup
    .number()
    .transform((value, originalValue) => Number(originalValue))
    .required('El id de la materia es requerido'),
  role: yup
    .mixed<SubjectRoles.TECHNOLOGY | SubjectRoles.THEORY>()
    .oneOf(getSubjectRoles(), 'El rol debe ser Teoría o Tecnología')
    .required('El rol es requerido'),
  start_date: yup
    .date()
    .transform((value, originalValue) => new Date(originalValue))
    .required('La fecha de inicio es requerida'),
  end_date: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
});

const subjectsHistorySchema = yup
  .array()
  .of(inputSubjectSchema)
  .nullable()
  .test(
    'no-overlapping-dates',
    'No puede haber fechas superpuestas en el historial, para la misma materia y rol.',
    (subjects) => {
      if (!subjects) return true;

      const grouped = new Map<
        string,
        { start_date: Date; end_date: Date | null }[]
      >();

      // Agrupar por subject_id y role
      for (const subject of subjects) {
        if (!subject.subject_id || !subject.role || !subject.start_date)
          continue;
        const key = `${subject.subject_id}-${subject.role}`;
        const group = grouped.get(key) || [];
        group.push({
          start_date: new Date(subject.start_date),
          end_date: subject.end_date ? new Date(subject.end_date) : null,
        });
        grouped.set(key, group);
      }

      // Validar superposición de fechas
      for (const group of grouped.values()) {
        const sorted = [...group].sort(
          (a, b) => a.start_date.getTime() - b.start_date.getTime()
        );
        for (let i = 0; i < sorted.length - 1; i++) {
          const current = sorted[i];
          const next = sorted[i + 1];

          if (
            !current.end_date || // Si la fecha de fin del actual está abierta, no puede haber otro después
            current.end_date > next.start_date // Fechas superpuestas
          ) {
            return false;
          }
        }
      }

      return true;
    }
  )
  .test(
    'single-open-date',
    'Para la misma materia y rol, solo puede haber hasta un registro sin fecha de fin',
    (subjects) => {
      if (!subjects) return true;

      const grouped = new Map<string, number>();

      // Contar registros sin fecha de fin por subject_id y rol
      for (const subject of subjects) {
        if (!subject.subject_id || !subject.role) continue;
        if (!subject.end_date) {
          const key = `${subject.subject_id}-${subject.role}`;
          grouped.set(key, (grouped.get(key) ?? 0) + 1);
        }
      }

      // Verificar que no haya más de un registro sin end_date
      for (const count of grouped.values()) {
        if (count > 1) return false;
      }

      return true;
    }
  );

export default subjectsHistorySchema;
