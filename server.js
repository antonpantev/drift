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

var categories = ["arts", "nightlife", "restaurants"];

app.get('/yelp', function(req, res) {
    var params;
    
    if(Object.keys(req.query).length > 0) {
        params = req.query;
    } else {
        params = {location: "Montreal"};
    }
    
    var count = categories.length;
    var arr = [];
    
    for(var i in categories) {
        var apiParams = createYelpParams(params);
        apiParams.category_filter = categories[i];
        yelp.search(apiParams, createYelpCallback(categories[i]));
    }
    
    function createYelpCallback(category) {

        return function(error, data) {
            data.businesses.sort(function(a,b) {
                if(a.distance < b.distance) {
                    return -1;
                } else if (a.distance == b.distance) {
                    return 0;
                } else {
                    return 1;
                }
            });
            
            arr.push({category: category, result: data.businesses});
            count--;
            
            /* If we are done sending requests to yelp then return the result */
            if(count == 0) {
                shuffle(arr);
                for(var i in arr) {
                    var result = arr[i].result[Math.floor(Math.random()*arr[i].result.length)];
                    arr[i].result = result;
                }
                res.json(arr);
            }
        };
    }
});

function createYelpParams(params) {
    var ret = {sort: 2, radius_filter:40000};
    
    for(var i in params) {
        ret[i] = params[i];
    }
    return ret;
}

function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});