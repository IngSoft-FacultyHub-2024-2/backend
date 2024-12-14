enum WeekDays {
  MONDAY = 'Lunes',
  TUESDAY = 'Martes',
  WEDNESDAY = 'Miércoles',
  THURSDAY = 'Jueves',
  FRIDAY = 'Viernes',
}

function getWeekDays(): WeekDays[] {
  return Object.values(WeekDays) as WeekDays[];
}

function translateWeekDayToEnglish(weekDay: WeekDays): string {
  switch (weekDay) {
    case WeekDays.MONDAY:
      return 'Monday';
    case WeekDays.TUESDAY:
      return 'Tuesday';
    case WeekDays.WEDNESDAY:
      return 'Wednesday';
    case WeekDays.THURSDAY:
      return 'Thursday';
    case WeekDays.FRIDAY:
      return 'Friday';
    default:
      throw new Error('Invalid week day');
  }
}

export { WeekDays, getWeekDays, translateWeekDayToEnglish };
