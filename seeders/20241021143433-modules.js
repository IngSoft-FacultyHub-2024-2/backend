'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Modules', [
      {
        time: '08:00 - 08:55',
        turn: 'Matutino',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        time: '09:00 - 09:55',
        turn: 'Matutino',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        'time': '10:05 - 11:00',
        'turn': 'Matutino',
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'time': '11:05 - 12:00',
        'turn': 'Matutino',
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'time': '12:05 - 13:00',
        'turn': 'Matutino',
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'time': '18:30 - 19:25',
        'turn': 'Vespertino',
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'time': '19:30 - 20:25',
        'turn': 'Vespertino',
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'time': '20:30 - 21:25',
        'turn': 'Vespertino',
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'time': '21:35 - 22:30',
        'turn': 'Vespertino',
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'time': '22:35 - 23:30',
        'turn': 'Vespertino',
        'createdAt': new Date(),
        'updatedAt': new Date()
      }
    ]
    );

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Modules', null, {});
  }
};
