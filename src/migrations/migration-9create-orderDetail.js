'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('OrderDetails', {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
         },
         orderId: {
            type: Sequelize.INTEGER,
            references: { model: 'Orders', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
         },
         productId: {
            type: Sequelize.INTEGER,
            references: { model: 'Products', key: 'id' },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
         },
         quantity: { type: Sequelize.INTEGER, allowNull: false },
         price: { type: Sequelize.DECIMAL(10, 2), allowNull: false }, // giá lúc mua
         createdAt: Sequelize.DATE,
         updatedAt: Sequelize.DATE,
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('OrderDetails');
   }
};