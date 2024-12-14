'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Needs', [
      {
        name: 'Salon grande',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Proyector',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Internet',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Needs', null, {});
  },
};
