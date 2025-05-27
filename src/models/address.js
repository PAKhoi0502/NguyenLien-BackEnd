'use strict';
const {
   Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class Address extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) { // cac moi quan he o day (nhieu - nhieu, nhieu - it,...)
         Address.belongsTo(models.User, { foreignKey: 'userId' });
      }
   };
   Address.init({
      userId: DataTypes.INTEGER,
      recipientName: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      addressLine1: DataTypes.STRING,
      addressLine2: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      postalCode: DataTypes.STRING,
      country: DataTypes.STRING,
      isDefault: DataTypes.BOOLEAN,
   }, {
      sequelize,
      modelName: 'Address',
   });
   return Address;
};