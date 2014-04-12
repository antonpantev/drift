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
    
    var source   = $("#resultTemplate").html();
    var template = Handlebars.compile(source);
    
    var context = {title: "My New Post", body: "This is my first post!"}
    var html    = template(context);
    
    console.log(html);

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
            
            $("#page2").show('slow', function() {
                initializeMap();
                calcRoute(places);
            });
        });
    });

    
});