/**
 * OnlineContacts model 
 * Gets all users, wich phone is in currentUser's ContactsNumber
 */

var app = app || {};

app.OnlineContacts = (function () {
    'use strict';

    
        app.el.Users.load;

        var currentUser = kendo.observable({ data: null });

        var show = function (e) {


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
                //console.log(currentUser.data.ContactsNumbers);
                //Get only contacts
                query.where()
                    .isin('PhoneNumber', userContactsNumbers)
                    .and()
                    .eq('IsOnline', true);
                usrs.get(query) // filter
                .then(function (res) {
                    var onlineContactsData = kendo.observable({ 
                        title: 'Online Contacts',
                        data: res.result
                    });

                    console.log(onlineContactsData.data);
                    
                    kendo.bind(e.view.element, onlineContactsData);
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
            show: show
        }
}());