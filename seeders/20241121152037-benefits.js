'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Benefits', [
      {
        name: 'Descuento en la mensualidad',
      },
      {
        name: 'Descuento en inscripción',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Benefits', null, {});
  },
};
