var position = null;

$(document).ready(function(){
    $("#readyButton").prop("disabled",true);

    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(pos) {
            position = [pos.coords.latitude, pos.coords.longitude];
            $("#readyButton").prop("disabled",false);
        });
    }
    
    $("#readyButton").click(function() {
        var params = { ll: position.toString() };
        $.get('/yelp', params, function(data) {
            console.log(data);
        });
    });

    //spinner 

    $('#spinner').addClass('spin');

    function stopSpinner() {
        $('#loading').addClass('hide');
        $('#loading').one('webkitTransitionEnd', function() {
            $('#loading').hide();
        });
    }

    // $(document).ajaxStop(function () {
    //     $.active == 0 
    //     stopSpinner();
    // });
});