enum WeekDays {
    MONDAY = 'Lunes',
    TUESDAY = 'Martes',
    WEDNESDAY = 'Miércoles',
    THURSDAY = 'Jueves',
    FRIDAY = 'Viernes'
}

function getWeekDays(): WeekDays[] {
    return Object.values(WeekDays) as WeekDays[];
}

export { WeekDays, getWeekDays };
