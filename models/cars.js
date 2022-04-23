'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cars extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cars.init({
    name: DataTypes.TEXT,
    rentPerDay: DataTypes.INTEGER,
    size: DataTypes.ENUM("small", "medium", "large"),
    photo: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'Cars',
  });
  return Cars;
};