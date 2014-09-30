
var app = app || {};

app.Sync = (function () {
    'use strict';


        var currentUser;

        var sync = function () {
            currentUser = app.Users.currentUser;
            //console.log(currentUser);
            loadContactsToDatabase();
        };
        var code = "359";
        var sanitize = function (phone) {
            var zero = phone.substring(0, 1);

            if (zero == '0') {
                phone = phone.slice(1);
                phone = code + phone;
            } else if(zero == '+'){
                return phone;
            }
            
            phone = phone.replace(/[^0-9]/g, '');
            phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1$2$3");
            return '+' + phone;
        }
            

        var loadContactsToDatabase = function () {
            var phoneNumbers = [];
            var options = new ContactFindOptions();
            options.filter = "0";
            options.multiple = true;
            var filter = ["phoneNumbers", "displayName"];

            navigator.contacts.find(filter, successLoadedToDatabase, errorLoadingContactsToDatabase, options);

            var pluses = new ContactFindOptions();
            pluses.filter = "+";
            pluses.multiple = true;
            var filter = ["phoneNumbers", "displayName"];

            navigator.contacts.find(filter, successLoadedToDatabase, errorLoadingContactsToDatabase, pluses);

            function successLoadedToDatabase(contacts) {
                var currentUserId = currentUser.data.Id;

                
                var i;
                var sanitized;
                for (i = 0; i < contacts.length; i++) {
                    if (contacts[i].phoneNumbers[0].value !== null) {
                        sanitized = sanitize(contacts[i].phoneNumbers[0].value);
                        console.log(sanitized);
                        phoneNumbers.push(sanitized);
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

        return {
            sync: sync,
            sanitize: sanitize
        }
}());