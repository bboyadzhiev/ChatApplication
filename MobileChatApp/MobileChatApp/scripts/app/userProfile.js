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

    var makePicture = function () {
        //navigator.camera.getPicture(onSuccess, onFail, {
        //    quality: 50,
        //    destinationType: Camera.DestinationType.DATA_URL
        //});

        //function onSuccess(imageData) {

        //    //var image = document.getElementById('myImage');
        //    //image.src = "data:image/jpeg;base64," + imageData;
        //    //console.log(image.src);

        //    //var file = {
        //    //    "Filename": "everlive111111.png",
        //    //    "ContentType": "image/jpeg",
        //    //    "CustomField": "customValue",
        //    //    "base64": image.src /* the file contents in base64 format */
        //    //};
            

        //    //app.el.Files.create(file,
        //    //    function (data) {
        //    //        alert(JSON.stringify(data));
        //    //    },
        //    //    function (error) {
        //    //        alert(JSON.stringify(error));
        //    //    });
        //}

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
            options.fileName = Math.random().toString(36).substring(7)+".jpg";
            options.mimeType = "image/jpeg";
            options.headers = app.el.buildAuthHeader();

            var ft = new FileTransfer();
            ft.upload(imageURI, uploadUrl, function (r) {
                var responseCode = r.responseCode;

                var res = JSON.parse(r.response);
                var uploadedFileId = res.Result[0].Id;
                var uploadedFileUri = res.Result[0].Uri;
                // use the Id and the Uri of the uploaded file 
                console.log("url" + uploadedFileUri);
                console.log("id" + uploadedFileId);
                console.log("responce" + responseCode);


                //update user info
                app.el.data.Users.updateSingle({ Id: currentUserId, Avatar: uploadedFileUri },
                function (data) {
                    alert(JSON.stringify(data));
                },
                function (error) {
                    alert(JSON.stringify(error));
                });

            }, function (error) {
                alert("An error has occurred:" + JSON.stringify(error));
            }, options);

        }


        function onFail(message) {
            alert('Failed because: ' + message);
        }

    };

    return {
        show: show,
        makePicture: makePicture
    }
}());