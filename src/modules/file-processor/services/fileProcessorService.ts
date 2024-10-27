import path from 'path';
import xlsx from 'xlsx';
import { processCourses } from './processCoursesService';

// const relevantSubjects = [
//     'Fundamentos de ingeniería de software',
//     'Diseño de aplicaciones 1',
//     'Diseño de aplicaciones 2',
//     'Ingeniería de software ágil 1',
//     'Arquitectura de Software',
//     'Ingeniería de Software Ágil 2',
//     'Arquitectura de Software en la práctica',
//     'Desarrollo de Productos de Base Tecnológica',
//     'Interacción humano-computadora'
// ];

export async function processFile(filename: string, type: string) {
    const filePath = path.join(__dirname, '../../../uploads', filename);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[3];
    const worksheet = workbook.Sheets[sheetName];

    const merges = worksheet['!merges'] || [];
    let data: any[] = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    merges.forEach((merge) => {
        const { s, e } = merge;
        const mergedValue = data[s.r][s.c];
        for (let row = s.r; row <= e.r; row++) {
            for (let col = s.c; col <= e.c; col++) {
                if (!data[row][col]) {
                    data[row][col] = mergedValue;
                }
            }
        }
    });

    if(type === 'COURSES') {
        return processCourses(data);
    }
}
