'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Addresses', {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
         },
         userId: {
            type: Sequelize.INTEGER,
            references: { model: 'Users', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
         },
         recipientName: { type: Sequelize.STRING, allowNull: false },
         phoneNumber: { type: Sequelize.STRING, allowNull: false },
         addressLine1: { type: Sequelize.STRING, allowNull: false },
         addressLine2: Sequelize.STRING,
         city: Sequelize.STRING,
         state: Sequelize.STRING,
         postalCode: Sequelize.STRING,
         country: Sequelize.STRING,
         isDefault: { type: Sequelize.BOOLEAN, defaultValue: false },
         createdAt: Sequelize.DATE,
         updatedAt: Sequelize.DATE,
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Addresses');
   }
};