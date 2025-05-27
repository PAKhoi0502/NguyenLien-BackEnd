'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('CartItems', {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
         },
         cartId: {
            type: Sequelize.INTEGER,
            references: { model: 'Carts', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
         },
         productId: {
            type: Sequelize.INTEGER,
            references: { model: 'Products', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
         },
         quantity: { type: Sequelize.INTEGER, defaultValue: 1 },
         createdAt: Sequelize.DATE,
         updatedAt: Sequelize.DATE,
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('CartItems');
   }
};