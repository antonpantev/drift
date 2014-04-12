var position = null;

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
            $("#page2").show('slow');
            console.log(data);
        });
    });

    
});