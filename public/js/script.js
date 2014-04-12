$(document).ready(function(){
    
    var position = null;
    $(function(){
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(function(pos) {
                position = [pos.coords.latitude, pos.coords.longitude];
            });
        }    
    });

});
