'use strict';
const {
   Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class Order extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) { // cac moi quan he o day (nhieu - nhieu, nhieu - it,...)
         Order.belongsTo(models.User, { foreignKey: 'userId' });
         Order.hasMany(models.OrderDetail, { foreignKey: 'orderId' });
      }
   };
   Order.init({
      userId: DataTypes.INTEGER,
      status: { type: DataTypes.STRING, defaultValue: 'pending' },
      totalAmount: DataTypes.DECIMAL(10, 2),
   }, {
      sequelize,
      modelName: 'Order',
   });
   return Order;
};