'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LectureRoles', 'number_of_teachers');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('LectureRoles', 'number_of_teachers', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },
};
