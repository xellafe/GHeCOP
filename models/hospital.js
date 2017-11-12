var moongose = require("mongoose");

var hospitalSchema = moongose.Schema({
    name: String,
    city: String
})

module.exports = moongose.model('Hospital', hospitalSchema);