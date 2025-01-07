'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Benefits', [
      {
        name: 'Descuento en la mensualidad',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Descuento en inscripción',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Benefits', null, {});
  },
};
