'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Create the join table for Subject and Need
    await queryInterface.createTable('SubjectNeed', {
      subject_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Subjects',  // Name of the Subjects table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      need_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Needs',  // Name of the Needs table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    // Optionally, drop the old subject_id column from the Needs table
    await queryInterface.removeColumn('Needs', 'subject_id');
  },

  async down (queryInterface, Sequelize) {
    // Revert the join table creation
    await queryInterface.dropTable('SubjectNeed');

    // Optionally, add the old subject_id column back to the Needs table
    await queryInterface.addColumn('Needs', 'subject_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Subjects',
        key: 'id',
      },
    });
  }
};
