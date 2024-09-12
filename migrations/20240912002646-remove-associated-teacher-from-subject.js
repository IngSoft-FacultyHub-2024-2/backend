'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Subjects', 'associated_teacher');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Subjects', 'associated_teacher', {
      type: Sequelize.INTEGER,
      allowNull: false, 
    });
  }
};
