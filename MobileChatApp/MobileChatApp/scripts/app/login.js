/**
 * Login view model
 */

var app = app || {};

app.Login = (function () {
    'use strict';

    var loginViewModel = (function () {

        var $loginUsername;
        var $loginPassword;

        var init = function () {

            //if (!app.isKeySet(appSettings.everlive.apiKey)) {
            //    app.mobileApp.navigate('views/noApiKey.html', 'fade');
            //}

            $loginUsername = $('#loginUsername');
            $loginPassword = $('#loginPassword');
        };

        // Authenticate to use Backend Services as a particular user
        var login = function () {

            var username = $loginUsername.val();
            var password = $loginPassword.val();

            app.el.Users.login(username, password)
                .then(function () {
                    return app.Users.load();
                })
                .then(function () {
                   // app.mobileApp.navigate('views/contactsView.html');
                    app.mobileApp.navigate('views/onlineContactsView.html');
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