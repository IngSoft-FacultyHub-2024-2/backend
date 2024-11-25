'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('StudyPlans', [
      {
        year: 2019,
        valid: true,
      },
      {
        year: 2021,
        valid: true,
      },
      {
        year: 2024,
        valid: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('StudyPlans', null, {});
  },
};
