'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Subjects', 'total_hours');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Subjects', 'total_hours', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
