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

$(document).ready(function(){
    $("#loading").hide();
    $("#readyButton").prop("disabled",true);

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
            $("#page2").show('slow', function() {
                initializeMap();
            });
            console.log(data);
        });
    });

    
});