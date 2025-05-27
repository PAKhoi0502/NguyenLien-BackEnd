'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Products', {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
         },
         name: { type: Sequelize.STRING, allowNull: false },
         description: Sequelize.TEXT,
         price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
         quantity: { type: Sequelize.INTEGER, defaultValue: 0 },
         categoryId: {
            type: Sequelize.INTEGER,
            references: { model: 'Categories', key: 'id' },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
         },
         createdAt: Sequelize.DATE,
         updatedAt: Sequelize.DATE,
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Products');
   }
};