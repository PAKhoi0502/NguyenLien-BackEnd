'use strict';
const {
   Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class Product extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
         Product.hasMany(models.ProductImage, { foreignKey: 'productId' });
         Product.hasMany(models.OrderDetail, { foreignKey: 'productId' });
         Product.hasMany(models.Review, { foreignKey: 'productId' });
      }
   };
   Product.init({
      name: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
      categoryId: DataTypes.INTEGER,
   }, {
      sequelize,
      modelName: 'Product',
   });
   return Product;
};