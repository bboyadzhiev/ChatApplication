/**
 * Users model
 */

var app = app || {};

app.Users = (function () {
    'use strict';

    var usersModel = (function () {
        var currentUser = kendo.observable({ data: null });
        var usersData;
        var loadUsers = function () {
            return app.el.Users.currentUser()
                .then(function (data) {
                    var currentUserData = data.result;
                    //currentUserData.PictureUrl = app.AppHelper.resolveProfilePictureUrl(currentUserData.Picture);
                    currentUser.set('data', currentUserData);
                    return app.el.Users.get();
                })
                .then(function (data) {
                    usersData = new kendo.data.ObservableArray(data.result);
                })
                .then(null,
                      function (err) {
                          app.showError(err.message);
                      }
                    );
        };
        return {
            load: loadUsers,
            users: function () {
                return usersData;
            },
            currentUser: currentUser
        };
    }());

    return usersModel;

}());