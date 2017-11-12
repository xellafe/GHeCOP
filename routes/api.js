var express = require('express');
var path = require('path');

var router = express.Router();

router.get('/', function(req, res) {

    var filesDir = path.dirname(__dirname);

    var options = {
        root: filesDir + '/files',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }

    var fileName = 'GHeCOP.txt';
    res.sendFile(fileName, options, function(err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

module.exports = router;