'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ratings', {
            rating_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', 
                    key: 'user_id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'product_id', 
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            rating: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            comment: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ratings');
    },
};