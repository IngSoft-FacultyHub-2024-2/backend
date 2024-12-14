'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Events', [
      {
        title: 'Obligatorio 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Parcial 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Events', null, {});
  },
};
