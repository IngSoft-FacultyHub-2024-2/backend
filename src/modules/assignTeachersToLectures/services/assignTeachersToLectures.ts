import { getSemesterLecturesToAssign } from '../../semester';
import { getTeachersToAssignLectures } from '../../teacher';

export async function assignTeachersToSemesterLectures(semesterId: number) {
  const teachersToAssign = await getTeachersToAssignLectures();
  const lecturesToAssign = await getSemesterLecturesToAssign(1);
  return lecturesToAssign;
}
