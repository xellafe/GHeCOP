var Patient = require("../models/patient");

module.exports = function(patient) {

    newPatient = new Patient();

    newPatient.name.first = patient.name;
    newPatient.name.last = patient.surname;
    newPatient.sex = patient.sex;
    newPatient.birthDate = patient.birthdate;
    newPatient.address.street = patient.address;
    newPatient.address.number = patient.civic;
    newPatient.address.city = patient.city;
    newPatient.code = patient.code;
    newPatient.doctor = patient.doctor_id;

    if(patient.hospitalized)
        newPatient.hospitalized = true;
    else
        newPatient.hospitalized = false;

    newPatient.save(function(err) {
        if (err) {
            console.log('Error in Saving user: ' + err);
            return false;
        }
    });

    return true;
}