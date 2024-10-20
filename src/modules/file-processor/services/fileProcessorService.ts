import path from 'path';
import xlsx from 'xlsx';

export async function processFile(filename: string) {
    const filePath = path.join(__dirname, '../../../uploads', filename);
    console.log(filePath);
    // Procesar el archivo Excel
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Selecciona la primera hoja
    const worksheet = workbook.Sheets[sheetName];

    // Convertir la hoja a formato JSON
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Procesar los datos...
    console.log(data);
}