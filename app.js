var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser');

var cors = require('cors');

var db;

if (process.env.ENV == 'Test') {
    db = mongoose.connect('mongodb://localhost/lotto_app_test');
} else {
    db = mongoose.connect('mongodb://localhost/lotto_app');
}

var LottoEntry = require('./app/models/lotto_entry');

//Finally get an express instance
var app = express();
var port = process.env.PORT || 3100;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//https://stackoverflow.com/questions/37465815/node-js-no-access-control-allow-origin-header-is-present-on-the-requested
app.use(cors());

lottoEntryRouter = require('./app/routes/lotto_entry.routes')(LottoEntry);

app.use('/api/lotto_entries', lottoEntryRouter);

app.get('/', function(req, res) {
    res.send('Welcome to the Lotto App api');
});

app.listen(port, function() {
    console.log('Gulp is running my app on PORT: ' + port);
});


module.exports = app;
