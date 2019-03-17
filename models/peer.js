'use strict';
module.exports = (sequelize, DataTypes) => {
  var Peer = sequelize.define('Peer', {
    hash: DataTypes.STRING,
    self: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Peer;
};