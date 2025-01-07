'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Degrees', [
      {
        name: 'Ingeniería en Sistemas',
        acronym: 'ID',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Licenciatura en Sistemas',
        acronym: 'AN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Degrees', null, {});
  },
};
