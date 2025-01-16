'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Semesters', 'study_plan_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'StudyPlans',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('Semesters', 'end_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Semesters', 'study_plan');
    await queryInterface.changeColumn('Semesters', 'end_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
