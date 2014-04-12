var position = null;

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

function initializeMap() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var chicago = new google.maps.LatLng(position[0], position[1]);
    var mapOptions = {
        zoom: 6,
        center: chicago
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
}

function calcRoute(places) {
    var start = places[0];
    var end = places[places.length-1];
    var waypts = [];

    for(var i = 1; i < places.length-1; i++) {
        waypts.push({
            location:places[i],
            stopover:true});
    }

    var request = {
        origin: start,
        destination: end,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

$(document).ready(function(){
    $("#loading").hide();
    $("#readyButton").prop("disabled",true);
    
    Handlebars.registerHelper('ifCond', function(v1, v2, options) {
      if(v1 != v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    });
    
    var source   = $("#resultTemplate").html();
    var template = Handlebars.compile(source);

    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(pos) {
            position = [pos.coords.latitude, pos.coords.longitude];
            $("#readyButton").prop("disabled",false);
        });
    }
    
    $("#readyButton").click(function() {
        $("#loading").show();
        
        var params = { ll: position.toString() };
        
        $.get('/yelp', params, function(data) {
            $("#loading").hide();
            $("#page1").hide('slow');            
            
            /* Update the map to show the route */
            var places = [];
            
            for(var i in data) {
                var address = data[i].result.location.display_address;
                
                var str = "";
                for(var j in address) {
                    str += address[j] + " ";
                }
                
                //console.log(str);
                places.push(str);
            }
            
            for(var i in data) {
                console.log(data[i].result);
            
                var context = {name: data[i].result.name, phone: data[i].result.phone, image_url: data[i].result.image_url, snippet_text: data[i].result.snippet_text};
                
                context.address = data[i].result.location.display_address;
                
                $("#results").append(template(context));
            }
            
            $("#page2").show('slow', function() {
                initializeMap();
                calcRoute(places);
            });
        });
    });

    
});