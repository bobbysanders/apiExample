var mongoose = require('mongoose');
var Location = mongoose.model('Location');

module.exports.allLocations = function(req, res){
    var offset = 0;
    var count = 5;

    if(req.query && req.query.offset && !(isNaN(req.query.offset))){
        offset = parseInt(req.query.offset, 10);
    }

    if (req.query && req.query.count && !(isNaN(req.query.count))) {
        count = parseInt(req.query.count, 10);
    }

    Location
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, locations){
            if(err){
                console.log("Error finding locations: ", err);
                res
                    .status(500)
                    .json(err)
            }
            else{
                console.log("Found Locations", locations.length);
                res
                    .status(200)
                    .json(locations)
            }
        })
}

module.exports.addLocation = function (req, res) {
    response = new Object
    newLocation = new Object
    if(req.body && req.body.locationNum && req.body.address && req.body.city && req.body.state && req.body.zipCode){
        newLocation.locationNum = parseInt(req.body.locationNum, 10);
        newLocation.location = new Object;
        newLocation.location.address = req.body.address;
        newLocation.location.state = req.body.state;
        newLocation.location.city = req.body.city;
        newLocation.location.zipCode = parseInt(req.body.zipCode, 10);
        if(req.body.long && req.body.lat){
            newLocation.location.coordinates = [req.body.long, req.body.lat]
        }
        console.log(newLocation);
        Location
            .create(newLocation, function (err, location) {
                if(err){
                    console.log('test1');
                    res
                        .status(500)
                        .json(err);
                    console.log('Error Creating Location: ', err);
                }
                else{
                    console.log('test2')
                    res
                        .status(201)
                        .json();
                    }
            })
    }
    else{
        res
            .status(400)
            .json('Data Missing from Body')
    }
}

module.exports.oneLocation = function (req, res) {
    locationNum = req.params.locationNum

    Location
        .find({locationNum: locationNum})
        .exec(function(err, locations){
            if (err) {
                console.log("Error finding locations: ", err);
                res
                    .status(500)
                    .json(err)
            }
            else if(locations.length == 0){
                console.log("Location "+locationNum+" not found")
                res
                    .status(404)
                    .json("Location does not exist")
            }
            else {
                console.log("Found Location", locationNum);
                res
                    .status(200)
                    .json(locations)
            }
        })
}

module.exports.allEmployees = function (req, res) {
    locationNum = req.params.locationNum

    Location
        .find({ locationNum: locationNum })
        .select('employees')
        .exec(function (err, locations) {
            if (err) {
                console.log("Error finding locations: ", err);
                res
                    .status(500)
                    .json(err)
            }
            else if (locations.length == 0) {
                console.log("Location " + locationNum + " not found")
                res
                    .status(404)
                    .json("Location does not exist")
            }
            else {
                console.log("Found Location", locationNum);
                res
                    .status(200)
                    .json(locations)
            }
        })
}

module.exports.addOneEmployee = function (req, res) {
    locationNum = req.params.locationNum

    newEmployee = new Object;
    if(req.body && req.body.firstName && req.body.lastName && req.body.employeeNum && req.body.address && req.body.city && req.body.state && req.body.zipCode){
        newEmployee = req.body;
        newEmployee.employeeNum = parseInt(newEmployee.employeeNum, 10)
        newEmployee.zipCode = parseInt(newEmployee.zipCode, 10)
        Location
            .find({locationNum: locationNum})
            .select('employees')
            .exec(function(err, location){
                if(err){
                    console.log("Error adding employee: ", err)
                    res
                        .status(500)
                        .json(err)
                }
                else if(location.length == 0){
                    console.log("Location not in database.");
                    res
                        .status(404)
                        .json("Location "+locationNum+" not in database. Add location or verify correct location was entered")
                }
                if(location.length > 0){
                    alreadyIn = false
                    for(employee in location[0].employees){
                        if(newEmployee.employeeNum == location[0].employees[employee].employeeNum){
                            alreadyIn =true
                        }
                    }
                    if(!(alreadyIn)){
                        location[0].employees.push(newEmployee);
                        location[0].save(function(err, locationUpdated){
                            if(err){
                                console.log("Error saving new employee ", err)
                                res
                                    .status(500)
                                    .json(err)
                            }
                            else{
                                res
                                    .status(201)
                                    .json(locationUpdated.employees[locationUpdated.employees.length - 1])
                            }
                        })
                    }
                    else{
                        res
                            .status(404)
                            .json("Employee already entered at this location")
                    }
                }
            })
        }
        else{
            res
                .status(404)
                .json('Data missing from body')
        }
}

module.exports.getOneEmployee = function (req, res) {
    locationNum = req.params.locationNum;
    employeeNum = req.params.employeeNum;
    message = new Array;

    Location
        .find({locationNum: locationNum})
        .select('employees')
        .exec(function(err, location){
            if(err){
                console.log("Error finding location ", err)
                res
                    .status(500)
                    .json(err)
            }
            else if(location.length == 0){
                res
                    .status(404)
                    .json("Location " + locationNum + " not in database. Add location or validate correct location was entered")
            }
            else{
                employeeID = new Array;
                for(employee in location[0].employees){
                    if(employeeNum == location[0].employees[employee].employeeNum){
                        employeeID.push(location[0].employees[employee]._id)
                    }
                }
                for(id in employeeID){
                    message.push(location[0].employees.id(employeeID[id]))
                }
                if(message.length > 0){
                    res
                        .status(200)
                        .json(message)
                }
                else{
                    res
                        .status(404)
                        .json("Employee not found")
                }
            }
        })
}

module.exports.deleteOneEmployee = function (req, res) {
    console.log('test')
    locationNum = req.params.locationNum;
    employeeNum = req.params.employeeNum;

    Location
        .find({locationNum: locationNum})
        .select('employees')
        .exec(function(err, location){
            if(err){
                console.log('test4')
                console.log('Error finding location: ', err);
                res
                    .status(500)
                    .json(err)
            }
            else if(!location){
                console.log('test3')
                res
                    .status(404)
                    .json("Could not find location "+locationNum+". Add location first or verify that correct location was entered.")
            }
            employeeID = new Array;
            for (employee in location[0].employees) {
                if (employeeNum == location[0].employees[employee].employeeNum) {
                    employeeID.push(location[0].employees[employee]._id)
                }
            }
            for (id in employeeID) {
                location[0].employees.id(employeeID[id]).remove()
            }
            location[0].save(function(err, location){
                if(err){
                    console.log('Error saving after deleting user ', err)
                    res
                        .status(500)
                        .json(err)
                }
                else{
                    res
                        .status(201)
                        .json()
                }
            })
        })
}