enum SubjectRoles {
  THEORY = 'Teórico',
  TECHNOLOGY = 'Tecnología',
}

function getSubjectRoles(): SubjectRoles[] {
  return Object.values(SubjectRoles) as SubjectRoles[];
}

function translateRolesToEnglish(role: string): string {
  switch (role) {
    case SubjectRoles.THEORY:
      return 'Theory';
    case SubjectRoles.TECHNOLOGY:
      return 'Technology';
    default:
      return role;
  }
}

export { SubjectRoles, getSubjectRoles, translateRolesToEnglish };
