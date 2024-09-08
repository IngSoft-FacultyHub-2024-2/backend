'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Teachers', 'cv_file', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('Teachers', 'id_photo', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Teachers', 'cv_file', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Teachers', 'id_photo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
