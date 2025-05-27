'use strict';
const {
   Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class ProductImage extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         ProductImage.belongsTo(models.Product, { foreignKey: 'productId' });
      }
   };
   ProductImage.init({
      productId: DataTypes.INTEGER,
      url: { type: DataTypes.STRING, allowNull: false },
   }, {
      sequelize,
      modelName: 'ProductImage',
   });
   return ProductImage;
};