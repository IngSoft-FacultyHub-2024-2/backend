import { getSemesterLecturesGroups } from '../../semester';
import { getTeachersToAssignLectures } from '../../teacher';

export async function assignTeachersToSemesterLectures(semesterId: number) {
  const teachersToAssign = await getTeachersToAssignLectures();
  return teachersToAssign;
}
