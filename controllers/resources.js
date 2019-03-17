var models = require('../models');
const Sequelize = require('sequelize');
const uuid = require('uuid');

resources = [{
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
}]

/**
 * List resources
 * @param {*} req 
 * @param {*} res 
 */
exports.index = (req, res) => {
    // models.resources.findAll().then(function (resources) {
    //     res.json(resources);
    // });
    res.json({"foda":"se"});
}

/**
 * List resources
 * @param {*} req 
 * @param {*} res 
 */
exports.listResources = (req, res) => {
    // models.resources.findAll().then(function (resources) {
    //     res.json(resources);
    // });
    res.json(resources);

    return resources;
}

/**
 * Get resources
 * @param {*} req 
 * @param {*} res 
 */
exports.getResources = (req, res) => {
    // models.resources.findAll().then(function (resources) {
    //     res.json(resources);
    // });
    res.json(resources[req.params.resourceId]);
}
