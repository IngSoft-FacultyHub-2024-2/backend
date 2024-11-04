enum SubjectRoles {
    THEORY = 'Teórico',
    TECHNOLOGY = 'Tecnología'
  }

function getSubjectRoles(): SubjectRoles[] {
  return Object.values(SubjectRoles) as SubjectRoles[];
}

export { SubjectRoles, getSubjectRoles };
