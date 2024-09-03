import sequelize from "../../../config/database";
import Benefit from "./models/Benefit";
import CaesCourse from "./models/CaesCourse";
import Category from "./models/Category";
import Contact from "./models/Contact";
import Prize from "./models/Prize";
import Teacher from "./models/Teacher";
import TeacherBenefit from "./models/TeacherBenefit";
import TeacherCategory from "./models/TeacherCategory";
import TeacherSubject from "./models/TeacherSubject";
import TeacherSubjectOfInterest from "./models/TeacherSubjectOfInterest";

class TeacherRepository {
    async addTeacher(teacher: Partial<Teacher>) {
        const transaction = await sequelize.transaction();
        try {
            // Extraer subjects_of_interest y otros datos del teacherData
            const { subjects_of_interest = [], categories = [], benefits = [] } = teacher;

            // Crear el Teacher y sus asociaciones directas
            const newTeacher = await Teacher.create(teacher, {
                include: [
                    { model: CaesCourse, as: 'caes_courses' },
                    { model: Contact, as: 'contacts' },
                    { model: Prize, as: 'prizes' },
                    { model: TeacherSubject, as: 'subjects' },
                    { model: TeacherCategory, as: 'teacher_categories' },
                    { model: TeacherBenefit, as: 'teacher_benefits' },
                ],
                transaction,
            });

            // Asociar subjects_of_interest
            if (subjects_of_interest.length > 0) {
                await this.associateSubjectsOfInterest(newTeacher.id, subjects_of_interest, transaction);
            }

            // Confirmar la transacción
            await transaction.commit();

            return newTeacher;
        } catch (error) {
            console.error('Error adding teacher:', error);

            // Realizar un rollback en caso de error
            await transaction.rollback();
            throw error;
        }
    }

    private async associateSubjectsOfInterest(teacherId: number, subjectIds: any[], transaction: any) {
        const subjectAssociations = subjectIds.map(subjectId => ({
            subject_id: subjectId,
            teacher_id: teacherId,
        }));
        await TeacherSubjectOfInterest.bulkCreate(subjectAssociations, { transaction });
    }
}

export default new TeacherRepository();
