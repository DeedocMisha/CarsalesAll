'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      fuel_type: {
        type: Sequelize.STRING,
        allowNull: true, 
      },
      speed: {
        type: Sequelize.INTEGER,
        allowNull: true, 
      },
      mileage: {
        type: Sequelize.INTEGER,
        allowNull: true, 
      },
      owner_count: {
        type: Sequelize.INTEGER,
        allowNull: true, 
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true, 
      },
      description: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      stock_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'category_id',
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  },
};