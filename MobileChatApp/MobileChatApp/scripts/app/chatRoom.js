/**
 * ChatRoom model 
 */

var app = app || {};

app.ChatRoom = (function () {
    'use strict';

    //app.el.Users.load;
    var currentUser;

    var show = function (e) {
        console.log('chatRoom.js')
        currentUser = app.Users.currentUser;
        var otherUser;

        var otherUserId = window.location.search.replace("?", "").split("&")[0];
        console.log(otherUserId);


        //var users = app.el.data('Users')
        //var otherUserQuery = new Everlive.Query();
        //otherUserQuery.getById(otherUserId)
        //    .then(function (resultUser) {
        //        otherUser = resultUser;
        //        console.log(otherUserId);
        //        console.log(otherUser);
        //    },
        //    function (error) {
        //        alert(JSON.stringify(error));
        //    });


        //var chatRooms = app.el.data('ChatRoom');

        //var currentCommonChatRoomQuery = new Everlive.Query();
        //currentCommonChatRoomQuery.where()
        //.isin(currentUser.data.Id, 'Participants')
        //.and()
        //.isin(otherUserId, 'Participants')

        //chatRooms.get(query)
        //.then(function (res) {
        //    console.log(res);


        //    var chatRoomViewModel = kendo.observable({
        //        title: 'Chat with ' 
        //    })
        //});

    };

    return {
        show: show
    }
}());