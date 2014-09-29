/**
 * Map view model
 */

var app = app || {};

app.Map = (function () {
    'use strict';

    var show = function (e) {
        //var currentUser = app.Users.currentUser;

        var mapModel = kendo.observable({
            title: "Where Am I?",
            //lat: currentUser.data.Geolocation.latitude,
            //long: currentUser.data.Geolocation.longitude
        });
        kendo.bind(e.view.element, mapModel);

        var map;

        var onSuccess = function (position) {
            function initialize() {
                var mapOptions = {
                    zoom: 16,
                    center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map = new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);

                var marker = new google.maps.Marker({
                    position: map.getCenter(),
                    map: map,
                    title: 'Click to zoom'
                });

                google.maps.event.addListener(map, 'center_changed', function () {
                    // 3 seconds after the center of the map has changed, pan back to the
                    // marker.
                    window.setTimeout(function () {
                        map.panTo(marker.getPosition());
                    }, 3000);
                });

                google.maps.event.addListener(marker, 'click', function () {
                    map.setZoom(6);
                    map.setCenter(marker.getPosition());
                });
            }

            google.maps.event.addDomListener(window, 'load', initialize());
            //console.log(map);
            //console.log(position.coords.latitude);
        };

        function onError(error) {
            return 'code: ' + error.code + '\n' + 'message: ' + error.message + '\n';
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }

    return {
        show: show
    }
}());