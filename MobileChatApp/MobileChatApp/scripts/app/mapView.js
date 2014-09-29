/**
 * Map view model
 */

var app = app || {};

app.Map = (function () {
    'use strict';

    var show = function (e) {
        var currentUser = app.Users.currentUser;

        var mapModel = kendo.observable({
            title: "Where Am I?",
            lat: currentUser.data.Geolocation.latitude,
            long: currentUser.data.Geolocation.longitude
        });
        kendo.bind(e.view.element, mapModel);
    }

    return {
        show: show
    }
}());