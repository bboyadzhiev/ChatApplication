/**
 * Contacts view model
 */

var app = app || {};

app.Contacts = (function () {
    'use strict';

    var contactsViewModel = (function () {
        var currentUser;

        var init = function () {
            currentUser = app.Users.currentUser;
            //console.log(currentUser);
            loadContactsToDatabase();
        };

        var loadContactsToDatabase = function () {
            var options = new ContactFindOptions();
            options.filter = "0";
            options.multiple = true;
            var filter = ["phoneNumbers", "displayName"];

            navigator.contacts.find(filter, successLoadedToDatabase, errorLoadingContactsToDatabase, options);

            function successLoadedToDatabase(contacts) {
                var currentUserId = currentUser.data.Id;

                var phoneNumbers = [];
                var i;
                for (i = 0; i < contacts.length; i++) {
                    if (contacts[i].phoneNumbers[0].value !== null) {
                        phoneNumbers.push(contacts[i].phoneNumbers[0].value);
                    }
                }

                app.el.Users.updateSingle({ Id: currentUserId, "ContactsNumbers": phoneNumbers }, function (data) {
                    console.log("Contacts Numbers loaded to database");
                }, function (err) {
                    console.log(JSON.stringify(err.message));
                });

                //console.log(phoneNumbers);
                //alert(i);
            }

            function errorLoadingContactsToDatabase(contactError) {
                alert(contactError.message);
            }
        };

        var navigateHome = function () {
            app.mobileApp.navigate('#welcome');
        };

        var logout = function () {
            app.helper.logout()
                .then(navigateHome, function (err) {
                    app.showError(err.message);
                    navigateHome();
                });
        };

        return {
            title: "Contacts",
            init: init,
            logout: logout
        }
    }());

    return contactsViewModel;
}());