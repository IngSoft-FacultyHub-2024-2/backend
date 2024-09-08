export enum WeekDays {
    MONDAY = 'Lunes',
    TUESDAY = 'Martes',
    WEDNESDAY = 'Miércoles',
    THURSDAY = 'Jueves',
    FRIDAY = 'Viernes',
    SATURDAY = 'Sábado',
    SUNDAY = 'Domingo',
}

export function getWeekDays(): WeekDays[] {
    return Object.values(WeekDays) as WeekDays[];
}