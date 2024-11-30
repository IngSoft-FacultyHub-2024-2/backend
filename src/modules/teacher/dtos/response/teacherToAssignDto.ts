export interface TeacherDTO {
  id: string; // Unique identifier for the teacher
  teacher: string; // Name or identifier of the teacher
  seniority: number; // Seniority in semesters
  subject_he_know_how_to_teach: Array<{
    subject: string; // Name of the subject
    role: string[]; // Roles the teacher can perform (e.g., "Theory")
  }>;
  available_times: {
    [day: string]: number[]; // Mapping of day names to available time slots (hours)
  };
  weekly_hours_max_work: number; // Maximum number of hours the teacher can work per week
  groups: Array<{
    my_role: string[]; // Roles the teacher has in this group
    subject: string; // Subject associated with the group
    other_teacher: Array<{
      teacher: string; // Name or identifier of another teacher in the group
      role: string[]; // Roles of the other teacher in this group
    }>;
  }>;
}
