'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Size.init({
    id_mobil: DataTypes.INTEGER,
    size: DataTypes.ENUM("small", "medium", "large")
  }, {
    sequelize,
    modelName: 'Size',
  });
  return Size;
};