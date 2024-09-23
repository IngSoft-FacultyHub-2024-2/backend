'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {    
    await queryInterface.addColumn('Subjects', 'study_plan_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow NULL initially
      references: {
        model: 'StudyPlans', 
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    // Step 2: Create a new StudyPlan and get its ID
    const [studyPlan] = await queryInterface.sequelize.query(`
      INSERT INTO "StudyPlans" (year, valid, "createdAt", "updatedAt")
      VALUES (2024, true, NOW(), NOW())
      RETURNING id;
    `);
    const studyPlanId = studyPlan[0].id; // Extract the new StudyPlan ID

    // Step 3: Update all subjects to point to the newly created StudyPlan
    await queryInterface.sequelize.query(`
      UPDATE "Subjects"
      SET "study_plan_id" = ${studyPlanId}
      WHERE "study_plan_id" IS NULL;

      UPDATE "Subjects"
      SET "study_plan_id" = 2024
      WHERE "study_plan_id" IS NULL;
    `);

    // Step 4: Alter the column to NOT NULL after the update
    await queryInterface.changeColumn('Subjects', 'study_plan_id', {
      type: Sequelize.INTEGER,
      allowNull: false,  // Set NOT NULL now that the column is populated
      references: {
        model: 'StudyPlans',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  async down (queryInterface, Sequelize) {
    // Step 1: Change the column to allow NULL again (reverse the NOT NULL constraint)
    await queryInterface.changeColumn('Subjects', 'study_plan_id', {
      type: Sequelize.INTEGER,
      allowNull: true,  // Allow NULL again
      references: {
        model: 'StudyPlans',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    // Step 2: Optionally, remove the study plan record that was inserted during the 'up' migration
    await queryInterface.sequelize.query(`
      DELETE FROM "StudyPlans" WHERE year = 2024;
    `);

    // Step 3: Remove the study_plan_id column from the Subjects table
    await queryInterface.removeColumn('Subjects', 'study_plan_id');
  }
};
