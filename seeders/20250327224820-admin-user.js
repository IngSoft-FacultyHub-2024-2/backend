'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Teachers',
      [
        {
          name: 'Super',
          surname: 'Admin',
          employee_number: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    const teacherId = await queryInterface.rawSelect(
      'Teachers',
      {
        where: {
          employee_number: 0,
        },
      },
      'id' // rawSelect devuelve solo este campo
    );

    if (!teacherId) {
      throw new Error('No se encontró el usuario Super Admin');
    }

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          teacher_id: teacherId,
          teacher_employee_number: 0,
          password: bcrypt.hashSync('admin123', 10),
          role_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'Users',
      { teacher_employee_number: '0' },
      {}
    );
    await queryInterface.bulkDelete('Teachers', { employeeNumber: '0' }, {});
  },
};
