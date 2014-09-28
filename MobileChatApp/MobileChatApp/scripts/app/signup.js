/**
 * Signup view model
 */
var app = app || {};

app.Signup = (function () {
    'use strict';

    var signupViewModel = (function () {
        var dataSource;
        var $signUpForm;
        var $formFields;
        var $signupBtnWrp;
        var validator;

        var init = function () {
            $signUpForm = $('#signUp');
            $formFields = $signUpForm.find('input, textarea, select');
            $signupBtnWrp = $('#signupBtnWrp');
            validator = $signUpForm.kendoValidator({
                                                       validateOnBlur: false
                                                   }).data('kendoValidator');

            $formFields.on('keyup keypress blur change input', function () {
                if (validator.validate()) {
                    $signupBtnWrp.removeClass('disabled');
                } else {
                    $signupBtnWrp.addClass('disabled');
                }
            });
        }

        var signup = function () {
            app.el.Users.register(
                dataSource.Username,
                dataSource.Password,
                dataSource)
                .then(function () {
                    app.showAlert("Registration successful");
                    app.mobileApp.navigate('#welcome');
                },
                      function (err) {
                          app.showError(err.message);
                      }
                    );
        };

        var show = function () {
            dataSource = kendo.observable({
                                              Username: '',
                                              Password: '',
                                              DisplayName: '',
                                              Email: '',
                                              ContactsNumbers:[]
                                          });
            kendo.bind($('#signup-form'), dataSource);
        };

        // Executed after hide of the Signup view
        // disable signup button
        var hide = function () {
            $signupBtnWrp.addClass('disabled');
        };

        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            sel.style.color = (selected == 0) ? '#b6c5c6' : '#34495e';
        }

        return {
            init: init,
            show: show,
            hide: hide,
            onSelectChange: onSelectChange,
            signup: signup
        };
    }());

    return signupViewModel;
}());