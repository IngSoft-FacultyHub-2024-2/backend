'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Degrees', [
      {
        name: 'Ingeniería en Sistemas',
        acronym: 'ID',
      },
      {
        name: 'Licenciatura en Sistemas',
        acronym: 'AN',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Degrees', null, {});
  },
};
