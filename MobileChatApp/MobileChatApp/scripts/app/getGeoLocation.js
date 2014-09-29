/**
 * GeoLocation
 */

var app = app || {};

app.GetGeoLocation = (function () {
    'use strict';

    var onSuccess = function (position) {
        return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
    };

    function onError(error) {
        return 'code: ' + error.code + '\n' + 'message: ' + error.message + '\n';
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

}());