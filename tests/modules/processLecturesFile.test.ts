// tests/processLecturesService.test.ts

import { getDegreeByAcronym } from '../../src/modules/degree';
import { FileDataDto } from '../../src/modules/file-processor/dtos/FileDataDto';
import { LectureDto } from '../../src/modules/file-processor/dtos/LecturesReturnDto';
import { processLectures } from '../../src/modules/file-processor/services/processLecturesService';
import { addLecture, getSemesterById } from '../../src/modules/semester';
import Semester from '../../src/modules/semester/repositories/models/Semester';
import {
  getAllSubjectNames,
  getSubjectNamesByStudyPlan,
} from '../../src/modules/subject';
import { getModules } from '../../src/modules/teacher';
import { SubjectRoles } from '../../src/shared/utils/enums/subjectRoles';

jest.mock('../../src/modules/degree');
jest.mock('../../src/modules/semester');
jest.mock('../../src/modules/subject');
jest.mock('../../src/modules/teacher');

describe('processLectures Service', () => {
  const mockFileData: FileDataDto = {
    semesterId: 1,
    fileType: 'LECTURES',
  };

  const mockModules = [
    { time: '08:00 - 09:00', id: 1 },
    { time: '09:00 - 10:00', id: 2 },
  ];

  const mockDegree = { id: 1, name: 'Ingeniería de Software' };
  const mockSubjects = [
    { id: 1, name: 'Fundamentos de Ingeniería de Software', StudyPlanId: 1 },
    { id: 2, name: 'Diseño de Aplicaciones', StudyPlanId: 1 },
  ];

  const mockData = [
    ['M1A', 'Fundamentos de Ingeniería de Software', 'Diseño de Aplicaciones'],
    [
      '08:00 - 09:00',
      'Fundamentos de Ingeniería de Software',
      'Diseño de Aplicaciones',
    ],
    [
      '09:00 - 10:00',
      'Diseño de Aplicaciones',
      'Fundamentos de Ingeniería de Software',
    ],
  ];

  const mockResult: LectureDto[] = [
    {
      lecture_groups: [{ name: 'M1A', roles: ['Teórico'] }],
      subject_name: 'Fundamentos de Ingeniería de Software',
    },
    {
      lecture_groups: [{ name: 'M1A', roles: ['Teórico'] }],
      subject_name: 'Diseño de Aplicaciones',
    },
  ];

  const mockSemester: Partial<Semester> = {
    id: 1,
    name: 'Semestre 1',
    study_plan_id: 1,
  };

  beforeEach(() => {
    // Mocks de las funciones externas
    (getDegreeByAcronym as jest.Mock).mockResolvedValue(mockDegree);
    (getAllSubjectNames as jest.Mock).mockResolvedValue(mockSubjects);
    (getModules as jest.Mock).mockResolvedValue(mockModules);
    (addLecture as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process lectures and return them', async () => {
    const sheetName = 'IS-2024';
    (getSemesterById as jest.Mock).mockResolvedValue(mockSemester);
    (getAllSubjectNames as jest.Mock).mockResolvedValue(mockSubjects);

    const result = await processLectures(mockFileData, mockData, sheetName);

    expect(getSemesterById).toHaveBeenCalledWith(mockSemester.id);
    expect(getDegreeByAcronym).toHaveBeenCalledWith('IS');
    expect(getAllSubjectNames).toHaveBeenCalledWith();
    expect(getModules).toHaveBeenCalled();
    expect(addLecture).toHaveBeenCalledTimes(2); // Asegura que se llamaron las veces correctas
    expect(result).toEqual(mockResult);
  });

  it('should not process lectures if degree is not found', async () => {
    (getDegreeByAcronym as jest.Mock).mockResolvedValue(null); // Simula que no se encontró el grado

    const result = await processLectures(mockFileData, mockData, 'IS-2024');

    expect(result).toBeUndefined();
  });

  it('should correctly map subjects and roles to lectures', async () => {
    (getSemesterById as jest.Mock).mockResolvedValue(mockSemester);
    (getSubjectNamesByStudyPlan as jest.Mock).mockResolvedValue(mockSubjects);

    const sheetName = 'IS-2024';
    const dataWithRoles = [
      [
        'M1A',
        'Fundamentos de Ingeniería de Software',
        'Diseño de Aplicaciones',
      ],
      [
        '08:00 - 09:00',
        'Fundamentos de Ingeniería de Software',
        'Diseño de Aplicaciones',
      ],
    ];

    // Llamar al servicio con los datos
    await processLectures(mockFileData, dataWithRoles, sheetName);

    // Verificar que se haya creado una clase con el rol de TEORÍA
    expect(addLecture).toHaveBeenCalledWith(
      expect.objectContaining({
        lecture_roles: expect.arrayContaining([
          expect.objectContaining({ role: SubjectRoles.THEORY }),
        ]),
      }),
      false
    );
  });

  it('should create a new lecture for each group', async () => {
    const sheetName = 'IS-2024';
    const dataWithMultipleGroups = [
      ['M1A', 'Fundamentos de Ingeniería de Software'],
      ['08:00 - 09:00', 'Fundamentos de Ingeniería de Software'],
      ['M2B', 'Diseño de Aplicaciones'],
      ['09:00 - 10:00', 'Diseño de Aplicaciones'],
    ];

    await processLectures(mockFileData, dataWithMultipleGroups, sheetName);

    // Verificar que se cree una clase para cada grupo
    expect(addLecture).toHaveBeenCalledTimes(2);
  });

  it('should handle missing module times correctly', async () => {
    const sheetName = 'IS-2024';
    const dataWithMissingModules = [
      ['M1A', 'Fundamentos de Ingeniería de Software'],
      ['08:00 - 09:00', 'Fundamentos de Ingeniería de Software'],
      ['M1A', 'Diseño de Aplicaciones'],
      ['09:00 - 10:00', 'Diseño de Aplicaciones'],
    ];

    await processLectures(mockFileData, dataWithMissingModules, sheetName);

    // Asegura que el módulo fue correctamente asignado
    expect(addLecture).toHaveBeenCalledTimes(2); // Se procesan 2 clases, una para cada grupo
  });

  it('should not add lecture if subject is not found', async () => {
    const dataWithUnmatchedSubject = [
      ['M1A', 'Materia Inexistente'],
      ['08:00 - 09:00', 'Materia Inexistente'],
    ];

    await processLectures(mockFileData, dataWithUnmatchedSubject, 'IS-2024');

    // No debería haber ninguna llamada a addLecture ya que la materia no se encuentra
    expect(addLecture).not.toHaveBeenCalled();
  });
});
