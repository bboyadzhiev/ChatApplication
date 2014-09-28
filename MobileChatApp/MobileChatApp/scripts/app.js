var app = (function () {
    'use strict';

    // global error handling
    var showAlert = function (message, title, callback) {
        navigator.notification.alert(message, callback || function () {
        }, title, 'OK');
    };

    var showError = function (message) {
        showAlert(message, 'Error occured');
        console.log(message, 'Error occured');
    };

    window.addEventListener('error', function (e) {
        e.preventDefault();
        var message = e.message + "' from " + e.filename + ":" + e.lineno;
        showAlert(message, 'Error occured');
        console.log(message, 'Error occured');
        return true;
    });

    var onBackKeyDown = function (e) {
        e.preventDefault();
        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
            var exit = function () {
                navigator.app.exitApp();
            };
            if (confirmed === true || confirmed === 1) {
                AppHelper.logout().then(exit, exit);
            }
        }, 'Exit', 'Ok,Cancel');
    };

    var fixViewResize = function () {
        if (device.platform === 'iOS') {
            setTimeout(function () {
                $(document.body).height(window.innerHeight);
            }, 10);
        }
    };

    var onDeviceReady = function () {
        //Handle document events
        document.addEventListener("backbutton", onBackKeyDown, false);

        navigator.splashscreen.hide();
        fixViewResize();
    };

    document.addEventListener("deviceready", onDeviceReady, false);

    // initialize Everlive SDK
    var el = new Everlive({
                              apiKey: appSettings.everlive.apiKey,
                              scheme: appSettings.everlive.scheme

                          });

    var AppHelper = {
        //resolveProfilePictureUrl: function (id) {
        //    if (id && id !== appSettings.emptyGuid) {
        //        return el.Files.getDownloadUrl(id);
        //    } else {
        //        return 'styles/images/avatar.png';
        //    }
        //},
        logout: function () {
            return el.Users.logout();
        }
    };

    var isKeySet = function (key) {
        var regEx = /^\$[A-Z_]+\$$/;
        return !isNullOrEmpty(key) && !regEx.test(key);
    };

    var mobileApp = new kendo.mobile.Application(document.body, { transition: 'slide', layout: 'mobile-tabstrip', skin: 'flat' });

    return {
        showAlert: showAlert,
        showError: showError,
        mobileApp: mobileApp,
        helper: AppHelper,
        isKeySet: isKeySet,
        el: el
    };
}());