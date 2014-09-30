/**
 * User profile view model
 */

var app = app || {};

app.UserProfile = (function () {
    'use strict';

    var currentUser;
    var userPicture;

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
                                             About: currentUser.data.About,
                                             Avatar: currentUser.data.Avatar
                                         });

        kendo.bind(e.view.element, userModel);
    };

    var makePicture = function () {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI
        });

        function onSuccess(imageURI) {
            var image = document.getElementById('myImage');
            image.src = imageURI;

            console.log(image.src);

            var uploadUrl = app.el.Files.getUploadUrl();
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = Math.random().toString(36).substring(7) + ".jpg";
            options.mimeType = "image/jpeg";
            options.headers = app.el.buildAuthHeader();

            var ft = new FileTransfer();
            ft.upload(imageURI, uploadUrl, function (r) {
                var responseCode = r.responseCode;

                var res = JSON.parse(r.response);
                var uploadedFileId = res.Result[0].Id;
                var uploadedFileUri = res.Result[0].Uri;
                // use the Id and the Uri of the uploaded file 
                //alert("url" + uploadedFileUri);
                //alert("id" + uploadedFileId);
                //alert("responce" + responseCode);
                //alert("user: " + app.Users.currentUser.data.Id);

                ////update user info
                updateUser(uploadedFileUri);
                navigator.notification.vibrate(2500);
            }, function (error) {
                alert("An error has occurred:" + JSON.stringify(error));
            }, options);
        }

        function updateUser(uploadedFileUri) {
            app.el.Users.updateSingle({ Id: app.Users.currentUser.data.Id, Avatar: uploadedFileUri },
                                      function (data) {
                                          //alert(JSON.stringify(data));
                                          console.log(JSON.stringify(data))
                                      },
                                      function (error) {
                                          alert(JSON.stringify(error));
                                      });
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    };

    return {
        show: show,
        makePicture: makePicture,
    }
}());