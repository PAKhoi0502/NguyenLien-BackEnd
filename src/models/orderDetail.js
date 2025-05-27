'use strict';
const {
   Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class OrderDetail extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) { // cac moi quan he o day (nhieu - nhieu, nhieu - it,...)
         OrderDetail.belongsTo(models.Order, { foreignKey: 'orderId' });
         OrderDetail.belongsTo(models.Product, { foreignKey: 'productId' });
      }
   };
   OrderDetail.init({
      orderId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.DECIMAL(10, 2),
   }, {
      sequelize,
      modelName: 'OrderDetail',
   });
   return OrderDetail;
};