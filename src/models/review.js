'use strict';
const {
   Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class Review extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) { // cac moi quan he o day (nhieu - nhieu, nhieu - it,...)
         Review.belongsTo(models.User, { foreignKey: 'userId' });
         Review.belongsTo(models.Product, { foreignKey: 'productId' });
      }
   };
   Review.init({
      userId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
   }, {
      sequelize,
      modelName: 'Review',
   });
   return Review;
};