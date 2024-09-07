'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('teacherSubjectGroupMembers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teachers',
          key: 'id',
        },
      },
      subject_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subject_groups',
          key: 'id',
        },
      },
      role: {
        type: Sequelize.ENUM('Teórico', 'Tecnología'),
        allowNull: false,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('teacherSubjectGroupMembers');
  }
};
