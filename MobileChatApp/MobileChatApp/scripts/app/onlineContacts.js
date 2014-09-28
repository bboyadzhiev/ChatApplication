/**
 * OnlineContacts model 
 * Gets all users, wich phone is in currentUser's ContactsNumber
 */

var app = app || {};

app.OnlineContacts = (function () {
    'use strict';


        app.el.Users.load;
        var currentUser = kendo.observable({ data: null });
        var onlineContactsData = new Array();

        var init = function (e) {

            // Get the data about the currently logged in user
            return app.el.Users.currentUser()
            .then(function (data) {
                var currentUserData = data.result;
                //currentUserData.PictureUrl = app.helper.resolveProfilePictureUrl(currentUserData.Picture);
                currentUser.set('data', currentUserData);

                // Get the data about all registered users
                return app.el.Users.get();
            })
            .then(function (data) {
                var userContactsNumbers = currentUser.data.ContactsNumbers;
                var usrs = app.el.data('Users');
                var query = new Everlive.Query();
                console.log(currentUser.data.ContactsNumbers);
                //Get only contacts
                query.where()
                    .isin('PhoneNumber', userContactsNumbers)
                    .and()
                    .eq('IsOnline', true);
                usrs.get(query) // filter
                .then(function (res) {
                    onlineContactsData = res.result;
                    console.log(onlineContactsData);
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

       // var logout = app.Contacts.logout;

        var ocvm = kendo.observable({
            title: 'Online Contacts',
            ocvmData: onlineContactsData
        });
        return {
           // title: 'Online Contacts',
            load: init,
            ocvm: ocvm,
            logout: logout,
            currentUser: currentUser // TODO: Is this needed?
        }
}());