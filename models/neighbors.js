'use strict';
module.exports = (sequelize, DataTypes) => {
  var Neighbors = sequelize.define('Neighbors', {
    hash: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Neighbors;
};