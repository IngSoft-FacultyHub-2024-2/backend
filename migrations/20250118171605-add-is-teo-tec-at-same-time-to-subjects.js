'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Subjects', 'is_teo_tec_at_same_time', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Subjects', 'is_teo_tec_at_same_time');
  }
};
