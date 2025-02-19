export interface LectureToAssign {
  id: number;
  subject: string;
  subClasses: {
    role: string;
    times: { [key: string]: number[] };
    num_teachers: number;
  }[];
}
