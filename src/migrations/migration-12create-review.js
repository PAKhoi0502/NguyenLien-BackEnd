'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Reviews', {
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
         productId: {
            type: Sequelize.INTEGER,
            references: { model: 'Products', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
         },
         rating: { type: Sequelize.INTEGER, allowNull: false }, // ví dụ 1-5
         comment: Sequelize.TEXT,
         createdAt: Sequelize.DATE,
         updatedAt: Sequelize.DATE,
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Reviews');
   }
};