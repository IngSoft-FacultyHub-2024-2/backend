import * as yup from 'yup';
import { WeekDays } from '../../../shared/utils/WeekDays';

const inputTeacherAbaailableModuleSchema = yup.object().shape({
    day_of_week:  yup.mixed<WeekDays.MONDAY | WeekDays.TUESDAY | WeekDays.WEDNESDAY | WeekDays.THURSDAY | WeekDays.FRIDAY | WeekDays.SATURDAY | WeekDays.SUNDAY>().oneOf(Object.values(WeekDays)).required(),
    module_id: yup.number().required(),
});

export default inputTeacherAbaailableModuleSchema;