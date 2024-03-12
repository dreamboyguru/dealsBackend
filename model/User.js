const mongoose = require('mongoose');

const EmployeesSchema = new mongoose.Schema({
    name: String,
    email: String, // Making email field unique
    phone: String,
    designation: String,
    gender: String,
    course: String,
    image: String,
    date : String,
});

const EmployeesModel = mongoose.model("employees", EmployeesSchema);

const LoginSchema = new mongoose.Schema({
    email: String, // Making email field unique
    password : String,
});

const LoginModel = mongoose.model("login", LoginSchema);

module.exports = { EmployeesModel, LoginModel };
