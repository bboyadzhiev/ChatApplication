/**
 * User profile view model
 */

var app = app || {};

app.UserProfile = (function () {
    'use strict';

        var currentUser;

        var show = function (e) {
            currentUser = app.Users.currentUser;

            var isOnline = currentUser.data.IsOnline;
            var value = "Offline";

            if (isOnline == true) {
                value = "Online";
            } 

            var userModel = kendo.observable({
                title: "User Profile",
                Username: currentUser.data.Username,
                DisplayName: currentUser.data.DisplayName,
                Email: currentUser.data.Email,
                IsOnline: value,
                PhoneNumber: currentUser.data.PhoneNumber,
                About: currentUser.data.About
            });

            kendo.bind(e.view.element, userModel);
        };

        return {
            show: show,
        }
}());