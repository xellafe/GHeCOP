var express = require('express');
var path = require('path');
var port = 10000;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('index', { title: "Hearth Monitor 01" });
});

app.listen(port, function() {
    console.log('heart_monitor_01 listening on port ' + port);
})