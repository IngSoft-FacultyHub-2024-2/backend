import { getSubjects } from "../../subject";

export async function processCourses(data: string[]) {
    const result = [];
    let currentGroup = '';
    const subjectsResponse = await getSubjects(undefined, undefined, undefined, 'ASC', 1, 1000, false);
    const relevantSubjects = subjectsResponse.subjects.map(subject => subject.name);

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        
        // Verificar si row[0] es un grupo
        if (typeof row[0] === 'string' && row[0].match(/^M\d{1,2}[A-Z]$/)) {
            currentGroup = row[0];
            continue;
        }

        // Identificar fila de horarios y materias
        if (currentGroup && row[0] && typeof row[0] === 'string' && row[0].includes(':')) {
            const hour = row[0].trim();
            const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

            for (let j = 1; j <= days.length; j++) {
                const subject = row[j] ? String(row[j]).toUpperCase() : '';
                // if (relevantSubjects.some(relevantSubject => subject?.includes(relevantSubject))) {
                if (relevantSubjects.some(subj => normalizeString(subject).includes(normalizeString(subj)))) {
                    const matchingSubject = relevantSubjects.find(subj => normalizeString(subject).includes(normalizeString(subj)))|| '';

                    result.push({
                        group: currentGroup,
                        subject: matchingSubject,
                        hourConfig: {
                            day: days[j - 1],
                            module: hour
                        }
                    });
                }
            }
        }
    }

    console.log(result);
}

function normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}