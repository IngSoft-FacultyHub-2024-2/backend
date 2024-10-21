import path from 'path';
import xlsx from 'xlsx';

const relevantSubjects = [
    'Fundamentos de ingeniería de software',
    'Diseño de aplicaciones 1',
    'Diseño de aplicaciones 2',
    'Ingeniería de software ágil 1',
    'Arquitectura de Software',
    'Ingeniería de Software Ágil 2',
    'Arquitectura de Software en la práctica',
    'Desarrollo de Productos de Base Tecnológica',
    'Interacción humano-computadora'
];

export async function processFile(filename: string) {
    const filePath = path.join(__dirname, '../../../uploads', filename);
    console.log(filePath);
    // Procesar el archivo Excel
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[3]; // Selecciona la primera hoja
    const worksheet = workbook.Sheets[sheetName];

    // Extraer información sobre celdas combinadas
    const merges = worksheet['!merges'] || [];

    // Convertir la hoja a JSON
    let data: any[] = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Rellenar celdas combinadas
    merges.forEach((merge) => {
        const { s, e } = merge; // s = start, e = end (rango de la celda combinada)
        const mergedValue = data[s.r][s.c]; // Valor de la celda combinada

        // Rellenar todas las celdas dentro del rango con el valor de la celda combinada
        for (let row = s.r; row <= e.r; row++) {
            for (let col = s.c; col <= e.c; col++) {
                if (!data[row][col]) {
                    data[row][col] = mergedValue;
                }
            }
        }
    });


    // Procesar los datos...
    console.log(data);
}