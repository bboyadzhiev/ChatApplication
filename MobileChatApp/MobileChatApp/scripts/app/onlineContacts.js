/**
 * OnlineContacts model 
 * Gets all users, wich phone is in currentUser's ContactsNumber
 */

var app = app || {};

app.OnlineContacts = (function () {
    'use strict';
    var onlineContactsModel = (function () {

        var title = 'Online Contacts';
        var currentUser = kendo.observable({ data: null });
        var onlineContactsData = new Array();

        var loadOnlineContacts = function () {

            // Get the data about the currently logged in user
            return app.everlive.Users.currentUser()
            .then(function (data) {
                var currentUserData = data.result;
                currentUserData.PictureUrl = app.helper.resolveProfilePictureUrl(currentUserData.Picture);
                currentUser.set('data', currentUserData);

                // Get the data about all registered users
                return app.everlive.Users.get();
            })
            .then(function (data) {
                var userContactsNumbers = currentUser.data.ContactsNumbers;
                var usrs = app.everlive.data('Users');
                var query = new Everlive.Query();

                //Get only contacts
                query.where().isin('PhoneNumber', userContactsNumbers);
                usrs.get(query) // filter
                .then(function (res) {
                    onlineContactsData = res.result;
                },
                function (error) {
                    alert(JSON.stringify(error));
                });

            })
            .then(null,
                  function (err) {
                      app.showError(err.message);
                  }
            );
        };
        return {
            load: loadOnlineContacts,
            onlineContacts: function () {
                return onlineContactsData;
            },
            currentUser: currentUser // TODO: Is this needed?
        }
    }());
    return onlineContactsModel;
}());