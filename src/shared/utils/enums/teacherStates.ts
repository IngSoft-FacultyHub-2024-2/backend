export enum TeacherStates {
    ACTIVE = 'activo',
    TEMPORARY_LEAVE = 'baja temporal',
    INACTIVE = 'baja',
}

export function getTeacherStates(): TeacherStates[] {
    return Object.values(TeacherStates) as TeacherStates[];
}