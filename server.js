var express = require("express");
var logfmt = require("logfmt");
var app = express();
var path = require('path');

var yelp = require("yelp").createClient({
    consumer_key: "RInGdOwUdcNaKNr02ztjUw", 
    consumer_secret: "LGzQkmE3hI978Dp3jurxFQK7Nr0",
    token: "ps1vTDY945DSZ7qJ3xjweV2-QMdxBh6I",
    token_secret: "yLgO35J-tAFeWpuP5NLoIrk7L1A"
});

app.use(logfmt.requestLogger());

app.use(express.static(path.join(__dirname, 'public')))

app.set('json spaces', 2);

app.get('/yelp', function(req, res) {
    var term = (req.query.term) ? req.query.term : "food";
    var location = (req.query.location) ? req.query.location : "Montreal";
    
    yelp.search({term: term, location: location}, function(error, data) {
        res.json(data);
    });
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});