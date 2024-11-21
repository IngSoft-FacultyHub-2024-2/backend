'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Needs', [
      {
        name: 'Salon grande',
      },
      {
        name: 'Proyector',
      },
      {
        name: 'Internet',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Needs', null, {});
  },
};
