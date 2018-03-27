var mongoose = require('mongoose');

var employeeSchema =  new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    employeeNum: {
        type: Number,
        required: true,
        unique: true,
        dropDups: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: Number,
        required: true  
    },
    phone: String,
    email: String
})

var locationSchema = new mongoose.Schema({
    locationNum :{ 
        type: Number,
        required: true,
        unique: true,
        dropDups: true
    },
    location : {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: Number,
            required: true
        },
        coordinates : {
            type: [Number],
            index: '2dSphere'
        }
    },
    employees: [employeeSchema]
})

mongoose.model('Location', locationSchema);