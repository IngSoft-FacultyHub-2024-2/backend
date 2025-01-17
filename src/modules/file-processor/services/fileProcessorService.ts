import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { FileTypes } from '../../../shared/utils/enums/fileTypes';
import { FileDataDto } from '../dtos/FileDataDto';
import { clearSemester, processLectures } from './processLecturesService';

export async function processFile(filename: string, fileData: FileDataDto) {
  const filePath = path.join(__dirname, '../../../uploads', filename);
  const workbook = xlsx.readFile(filePath);
  let ret = [];

  if (fileData.fileType === FileTypes.LECTURES) {
    if (!fileData.semesterId) {
      throw new Error(
        'Se necesita el id del semestre para procesar la subida de dictados'
      );
    }

    await clearSemester(fileData.semesterId);
  }

  for (let i = 0; i < workbook.SheetNames.length; i++) {
    const sheetName = workbook.SheetNames[i];
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
    if (fileData.fileType === FileTypes.LECTURES) {
      const returnLectures = await processLectures(fileData, data, sheetName);

      ret.push({
        sheetName,
        lectures: returnLectures || [],
      });
    }
  }
  fs.unlinkSync(filePath);
  return ret;
}
