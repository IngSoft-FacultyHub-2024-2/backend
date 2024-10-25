'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('TeacherAvailableModules', 'module');
    await queryInterface.addColumn('TeacherAvailableModules', 'module_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Modules',
        key: 'id'
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
