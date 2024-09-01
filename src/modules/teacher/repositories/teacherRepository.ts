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
            // Extraer y eliminar subjects_of_interest del objeto teacher
            const subjectsOfInterestIds = teacher.subjects_of_interest || [];
            delete teacher.subjects_of_interest;

            // Crear el Teacher y sus asociaciones directas
            const newTeacher = await Teacher.create(teacher, {
                include: [
                    { model: CaesCourse, as: 'caes_courses' },
                    { model: Contact, as: 'contacts' },
                    { model: Prize, as: 'prizes' },
                    { model: TeacherSubject, as: 'subjects' },
                ],
                transaction,
            });

            // Asociar las categorías
            if (teacher.categories && teacher.categories.length > 0) {
                const categoryAssociations = teacher.categories.map(categoryId => ({
                    teacher_id: newTeacher.id,
                    category_id: categoryId,
                }));
                await TeacherCategory.bulkCreate(categoryAssociations, { transaction });
            }

            // Asociar los beneficios
            if (teacher.benefits && teacher.benefits.length > 0) {
                const benefitAssociations = teacher.benefits.map(benefitId => ({
                    teacher_id: newTeacher.id,
                    benefit_id: benefitId,
                }));
                await TeacherBenefit.bulkCreate(benefitAssociations, { transaction });
            }


            // Asociar subjects_of_interest
            if (subjectsOfInterestIds.length > 0) {
                const subjectsOfInterest = subjectsOfInterestIds.map(id => ({
                    subject_id: id,
                    teacher_id: newTeacher.id,
                }));

                await TeacherSubjectOfInterest.bulkCreate(subjectsOfInterest, { transaction });
            }

            // Confirmar la transacción
            await transaction.commit();

            return newTeacher;
        } catch (error) {
            console.error(error);

            // Realizar un rollback en caso de error
            await transaction.rollback();
            throw error;
        }
    }
}

export default new TeacherRepository();
