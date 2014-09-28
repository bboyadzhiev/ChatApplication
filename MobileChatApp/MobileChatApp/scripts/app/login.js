/**
 * Login view model
 */

var app = app || {};

app.Login = (function () {
    'use strict';

    var loginViewModel = (function () {
        var currentUser;
        var $loginUsername;
        var $loginPassword;

        var init = function () {
            //if (!app.isKeySet(appSettings.everlive.apiKey)) {
            //    app.mobileApp.navigate('views/noApiKey.html', 'fade');
            //}
            $loginUsername = $('#loginUsername');
            $loginPassword = $('#loginPassword');
        };

        var getGeoLocation = function() {
            var onSuccess = function (position) {

                currentUser = app.Users.currentUser;
                var currentUserId = currentUser.data.Id;
                console.log(currentUserId);

                app.el.Users.updateSingle({ Id: currentUserId, "Geolocation": new Everlive.GeoPoint(position.coords.longitude, position.coords.latitude) }, function (data) {
                    console.log("geopoint added to database");
                }, function (err) {
                    console.log(JSON.stringify(err.message));
                });

                return {
                    Latitude: position.coords.latitude,
                    Longitude:  position.coords.longitude
                }

            };

            // onError Callback receives a PositionError object
            //
            function onError(error) {
                alert('code: ' + error.code + '\n' +
                      'message: ' + error.message + '\n');
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }

        // Authenticate to use Backend Services as a particular user
        var login = function () {
            var username = $loginUsername.val();
            var password = $loginPassword.val();

            app.el.Users.login(username, password)
                .then(function () {
                    return app.Users.load();
                })
                .then(function () {
                    getGeoLocation();
                    currentUser = app.Users.currentUser;
                    var currentUserId = currentUser.data.Id;
                    console.log(currentUserId);

                    app.el.Users.updateSingle({ Id: currentUserId, "IsOnline": true }, function (data) {
                        console.log("User status set to online");
                    }, function (err) {
                        console.log(JSON.stringify(err.message));
                    });
                })
                .then(function () {
                    app.mobileApp.navigate('views/contactsView.html');
                    // app.mobileApp.navigate('views/onlineContactsView.html');
                })
                .then(null,
                      function (err) {
                          console.log(err.message)
                          app.showError(err.message);
                      }
                    );
        };
        
        var show = function () {
            $loginUsername.val('');
            $loginPassword.val('');
        };

        return {
            init: init,
            show: show,
            login: login
        };
    }());

    return loginViewModel;
}());