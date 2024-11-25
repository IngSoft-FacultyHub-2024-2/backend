export interface LecturesReturnDto {
  sheetName: string;
  lectures: LectureDto[];
}

export interface LectureDto {
  subject_name: string;
  lecture_groups: {
    name: string;
    roles: string[];
  }[];
}
