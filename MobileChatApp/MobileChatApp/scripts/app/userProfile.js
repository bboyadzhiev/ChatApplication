/**
 * User profile view model
 */

var app = app || {};

app.UserProfile = (function () {
    'use strict';

        var currentUser;

        var show = function (e) {
            currentUser = app.Users.currentUser;

            var userModel = kendo.observable({
                title: "User Profile",
                Username: currentUser.data.Username,
                Name: currentUser.data.DisplayName,
                Email: currentUser.data.Email,
                IsOnline: currentUser.data.IsOnline,
                PhoneNumber: currentUser.data.PhoneNumber
            });

            kendo.bind(e.view.element, userModel);
        };

        return {
            show: show,
        }
}());