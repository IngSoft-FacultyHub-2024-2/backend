import * as yup from 'yup';
import { getWeekDays, WeekDays } from '../../../shared/utils/enums/WeekDays';

const inputLectureConfigHourSchema = yup.object().shape({
    day_of_week: yup.mixed<WeekDays.MONDAY | WeekDays.TUESDAY | WeekDays.WEDNESDAY | WeekDays.THURSDAY | WeekDays.FRIDAY >()
    .oneOf(getWeekDays(), "El dia debe ser valido"),
    modules: yup.array().of(yup.number().required("El modulo es requerido")).required("Los modulos de horarios son requeridos"),
});

export default inputLectureConfigHourSchema;