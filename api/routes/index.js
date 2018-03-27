var express = require('express');
var router = express.Router();

var ctrlLocation = require('../controllers/location.controller.js');

router
    .route('/locations')
    .get(ctrlLocation.allLocations)
    .post(ctrlLocation.addLocation);

router
    .route('/locations/:locationNum')
    .get(ctrlLocation.oneLocation);

router
    .route('/locations/:locationNum/employees')
    .get(ctrlLocation.allEmployees)
    .post(ctrlLocation.addOneEmployee);

router
    .route('/locations/:locationNum/employees/:employeeNum')
    .get(ctrlLocation.getOneEmployee)
    .delete(ctrlLocation.deleteOneEmployee)


module.exports = router

