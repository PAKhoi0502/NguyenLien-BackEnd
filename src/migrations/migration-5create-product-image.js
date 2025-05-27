'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('ProductImages', {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
         },
         productId: {
            type: Sequelize.INTEGER,
            references: { model: 'Products', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
         },
         url: { type: Sequelize.STRING, allowNull: false },
         createdAt: Sequelize.DATE,
         updatedAt: Sequelize.DATE,
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('ProductImages');
   }
};