'use strict'; 

const uuid = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      
    */
    return queryInterface.bulkInsert('Resources', [{
        id: 1,
        uuid: uuid(),
        type: "temperature",
        name: "res1",
        extAddr: "http://127.0.0.1/",
        localAddr: "http://127.0.0.1/",
        status: true
      }, {
        id: 2,
        name: "res2",
        uuid: uuid(),
        type: "temperature",
        extAddr: "http://127.0.0.1/",
        localAddr: "http://127.0.0.1/",
        status: true
      }, {
        id: 3,
        name: "res3",
        uuid: uuid(),
        type: "temperature",
        extAddr: "http://127.0.0.1/",
        localAddr: "http://127.0.0.1/",
        status: true
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Resources', null, {});
  }
};
