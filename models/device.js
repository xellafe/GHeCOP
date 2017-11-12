var moongose = require("mongoose");

var deviceSchema = moongose.Schema({
    name: String,
    type: String,
    doctor_id: String,
    patient_id: String
})

module.exports = moongose.model('Device', deviceSchema);