'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Teachers', {
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
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      birth_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      employee_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      cv_file: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      how_they_found_us: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      id_photo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      hiring_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      linkedin_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      graduated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.ENUM('activo', 'baja temporal', 'baja'),
        allowNull: false,
        defaultValue: 'activo',
      },
      unsusbribe_risk: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.dropTable('Teachers');
  }
};
