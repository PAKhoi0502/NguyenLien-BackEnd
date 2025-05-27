'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Payments', {
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
         method: { type: Sequelize.STRING },
         status: { type: Sequelize.STRING },
         transactionId: { type: Sequelize.STRING },
         createdAt: Sequelize.DATE,
         updatedAt: Sequelize.DATE,
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Payments');
   }
};