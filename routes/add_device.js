var Device = require("../models/device");

module.exports = function(device) {
    
    newDevice = new Device();

    newDevice.name = device.name;
    newDevice.type = device.type;
    newDevice.doctor_id = device.doctor_id;

    newDevice.save(function(err) {
        if (err) {
            console.log('Error in Saving device: ' + err);
            return false;
        }
    });

    return true;
}