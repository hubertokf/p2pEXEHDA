'use strict';
module.exports = (sequelize, DataTypes) => {
  var Resources = sequelize.define('Resources', {
    uuid: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    uri: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Resources;
};