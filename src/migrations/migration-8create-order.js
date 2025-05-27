'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Orders', {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
         },
         userId: {
            type: Sequelize.INTEGER,
            references: { model: 'Users', key: 'id' },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
         },
         status: { type: Sequelize.STRING, defaultValue: 'pending' },
         totalAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
         createdAt: Sequelize.DATE,
         updatedAt: Sequelize.DATE,
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Orders');
   }
};