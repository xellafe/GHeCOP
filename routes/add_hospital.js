var Hospital = require("../models/hospital");

module.exports = function(hospital) {
    
    newHospital = new Hospital();

    newHospital.name = hospital.name;
    newHospital.city = hospital.city;

    newHospital.save(function(err) {
        if (err) {
            console.log('Error in Saving hospital: ' + err);
            return false;
        }
    });

    return true;
}