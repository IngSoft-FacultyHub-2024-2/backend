'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Teachers', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Teachers', 'retentionDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Teachers', 'deletedAt');
    await queryInterface.removeColumn('Teachers', 'retentionDate');
  }
};
