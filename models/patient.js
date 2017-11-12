var mongoose = require("mongoose");

var patientSchema = mongoose.Schema({
    name: { first: String, last: String },
    sex: String,
    birthDate: String,
    address: { street: String, number: String, city: String },
    code: String,
    doctor: String,
    hospitalized: Boolean,
    created: { type: Date, default: Date.now },
    updated: Date
});

module.exports = mongoose.model('Patient', patientSchema);