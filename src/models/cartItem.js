'use strict';
const {
   Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class CartItem extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) { // cac moi quan he o day (nhieu - nhieu, nhieu - it,...)
         CartItem.belongsTo(models.Cart, { foreignKey: 'cartId' });
         CartItem.belongsTo(models.Product, { foreignKey: 'productId' });
      }
   };
   CartItem.init({
      cartId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
   }, {
      sequelize,
      modelName: 'CartItem',
   });
   return CartItem;
};