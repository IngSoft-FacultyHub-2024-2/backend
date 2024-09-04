enum TeacherRoles {
    THEORY = 'Teórico',
    TECHNOLOGY = 'Tecnología'
  }

function getTeacherRoles(): TeacherRoles[] {
  return Object.values(TeacherRoles) as TeacherRoles[];
}

export {TeacherRoles, getTeacherRoles}