'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Subjects', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subject_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      study_plan_year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      associated_teacher: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Teachers',
          key: 'id',
        },
      },
      associated_coordinator: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Teachers',
          key: 'id',
        },
      },
      index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      frontal_hours: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      intro_folder: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subject_folder: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tecnologies: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      valid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Subjects');
  }
};
