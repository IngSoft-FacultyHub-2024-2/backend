'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Subjects', 'study_plan_year');
    
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

    // Step 5: Remove the old study_plan_year column
    await queryInterface.removeColumn('Subjects', 'study_plan_year');
  },

  async down (queryInterface, Sequelize) {
    // Reverse the changes: Add back study_plan_year and remove study_plan_id
    await queryInterface.addColumn('Subjects', 'study_plan_year', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.removeColumn('Subjects', 'study_plan_id');
  }
};
