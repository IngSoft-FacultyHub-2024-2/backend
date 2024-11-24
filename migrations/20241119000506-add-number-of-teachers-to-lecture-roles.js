'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('LectureRoles', 'number_of_teachers', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // Ensure all existing records have a valid default value
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('LectureRoles', 'number_of_teachers');
  }
};
