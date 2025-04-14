  'use strict';

  module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('roles', {
        role_id: {
          type: Sequelize.INTEGER, 
          primaryKey: true,
          allowNull: false,
          autoIncrement: true, 
        },
        name: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING(100),
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      });
    },

    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('roles');
    },
  };