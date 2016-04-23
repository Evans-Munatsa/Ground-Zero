

$(function(){

    var distanceTemplate = Handlebars.compile($("#distanceTemplate").html());
    var nearestTemplate = Handlebars.compile($("#nearestTemplate").html());
    var radiusTemplate = Handlebars.compile($("#radiusTemplate").html());

    $("#get_distance").click(function(){

        var selected = $('input[name="selected"]:checked');
        var from = selected[0].value;
        var to = selected[1].value;
        $.getJSON('/api/distance/' + from + '/' + to, function(data){
            $("#distance").html(distanceTemplate(data));
        });

    });

    $("#in_circle").click(function(){

        var selected = $('input[name="selected"]:checked');
        var from = selected[0].value;
        var to = selected[1].value;

        var distance = $("#slider").val();

        $.getJSON('/api/in_circle/' + from + '/' + to + '/' + distance, function(data){
            $("#distance").html(radiusTemplate(data));
        });

    });

    $("#get_closest").click(function(){

        var selected = $('input[name="selected"]:checked');
        var from = selected[0].value;

        $.getJSON('/api/nearest/' + from, function(data){
            $("#distance").html(nearestTemplate(data));
        });

    });

    $("#get_center").click(function(){

        $.getJSON('/api/center', function(data){
            $("#distance").html(data.center.latitude + ", " + data.center.longitude);
        });

    });

    $("#put_on_map").click(function(){
        var selected = $('input[name="selected"]:checked');

        var from = selected[0].value;


        $.getJSON('/api/selected/' + from, function(results){
            addMarker(results.location);
        })

    });

    $("#clear_markers").click(function(){
        clearMarkers();
    })

    $("#hide_map").click(function () {
        $("#map").toggle();
    })

    $("#slider").on("change", function(evt){
        $("#circleSize").text(evt.target.value);
    });

    var map;
    var markers = [];

    window.initMap = function() {
        var myLatLng = {
            lat: -33.906946,
            lng: 18.4189704
        };

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: myLatLng
        });

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Hello World!'
        });
    };


    function addMarker(location) {
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });
        markers.push(marker);
    }

    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
      setMapOnAll(null);
    }

});
