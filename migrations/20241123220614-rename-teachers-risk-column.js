'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Renombrar columna 'oldColumnName' a 'newColumnName' en la tabla 'Teachers'
    await queryInterface.renameColumn('Teachers', 'unsusbribe_risk', 'unsubscribe_risk');
  },

  async down(queryInterface, Sequelize) {
    // Revertir el cambio renombrando 'newColumnName' a 'oldColumnName'
    await queryInterface.renameColumn('Teachers', 'unsubscribe_risk', 'unsusbribe_risk');
  },
};
