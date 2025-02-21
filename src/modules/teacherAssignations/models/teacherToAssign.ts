export interface TeacherToAssign {
  id: number;
  seniority: number;
  subject_he_know_how_to_teach: { subject: string; role: string[] }[];
  available_times: { [key: string]: number[] };
  weekly_hours_max_work: number;
  groups: {
    my_role: string[];
    subject: string;
    other_teacher: { teacher: string; role: string[] }[];
  }[];
}
