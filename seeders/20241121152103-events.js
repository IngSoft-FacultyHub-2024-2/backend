'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Events', [
      {
        title: 'Obligatorio 1',
      },
      {
        title: 'Parcial 1',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Events', null, {});
  },
};
