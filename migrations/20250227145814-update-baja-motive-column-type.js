/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Primero, creamos una nueva columna temporal con el tipo ARRAY(STRING)
      await queryInterface.addColumn(
        'Teachers',
        'dismiss_motive_temp',
        {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true,
        },
        { transaction }
      );

      // Migramos los datos: Convertimos los valores antiguos a un array (si es necesario)
      await queryInterface.sequelize.query(
        `
        UPDATE "Teachers"
        SET "dismiss_motive_temp" = ARRAY["dismiss_motive"]
        WHERE "dismiss_motive" IS NOT NULL;
      `,
        { transaction }
      );

      // Eliminamos la columna original
      await queryInterface.removeColumn('Teachers', 'dismiss_motive', {
        transaction,
      });

      // Renombramos la columna temporal a la original
      await queryInterface.renameColumn(
        'Teachers',
        'dismiss_motive_temp',
        'dismiss_motive',
        { transaction }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Creamos una nueva columna temporal con el tipo original
      await queryInterface.addColumn(
        'Teachers',
        'dismiss_motive_temp',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction }
      );

      // Migramos los datos de vuelta a STRING (tomamos el primer valor del array)
      await queryInterface.sequelize.query(
        `
        UPDATE "Teachers"
        SET "dismiss_motive_temp" = dismiss_motive[1]
        WHERE "dismiss_motive" IS NOT NULL;
      `,
        { transaction }
      );

      // Eliminamos la columna ARRAY
      await queryInterface.removeColumn('Teachers', 'dismiss_motive', {
        transaction,
      });

      // Renombramos la columna temporal a la original
      await queryInterface.renameColumn(
        'Teachers',
        'dismiss_motive_temp',
        'dismiss_motive',
        { transaction }
      );
    });
  },
};
