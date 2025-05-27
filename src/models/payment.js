'use strict';
const {
   Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class Payment extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) { // cac moi quan he o day (nhieu - nhieu, nhieu - it,...)
         Payment.belongsTo(models.Order, { foreignKey: 'orderId' });
      }
   };
   Payment.init({
      orderId: DataTypes.INTEGER,
      method: DataTypes.STRING,
      status: DataTypes.STRING,
      transactionId: DataTypes.STRING,
   }, {
      sequelize,
      modelName: 'Payment',
   });
   return Payment;
};