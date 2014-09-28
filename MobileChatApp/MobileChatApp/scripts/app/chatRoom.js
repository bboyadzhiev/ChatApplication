/**
 * ChatRoom model 
 */

var app = app || {};

app.ChatRoom = (function () {
    'use strict';

    //app.el.Users.load;
    var show = function (e) {

        var currentUser;
        var chatRoom;

        function getUrlVars() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }

        var first = getUrlVars()["id"];


        console.log('chatRoom.js')
        currentUser = app.Users.currentUser;
        var otherUser;
        var chatRoomId;

        var otherUserId = first;
        console.log('This User ID:' + currentUser.data.Id);
        console.log('Other User ID: ' + otherUserId);

        var users = app.el.data('Users')
        users.getById(otherUserId)
            .then(function (resultUser) {
                // Contact found
                otherUser = resultUser.result;
                console.log('Other User Found: ' + otherUser.DisplayName);
            },
            function (error) {
                alert(JSON.stringify(error));
            })
                  .then(function () {
                      // Find or create the ChatRoom
                      var currentCommonChatRoomQuery = new Everlive.Query();
                      currentCommonChatRoomQuery.where()
                      .isin('Participants', [otherUserId, currentUser.data.Id]);
                      //.isin(currentUser.data.Id, 'Participants')
                      //.and()
                      console.log('Checking for existing chatroom ... ');
                      var chatRooms = app.el.data('ChatRoom');
                      chatRooms.get(currentCommonChatRoomQuery)
                      .then(function (res) {
                          if (res.result.length > 0) {
                              chatRoom = res.result[0];
                              console.log('Found ChatRoom: ');
                              console.log(JSON.stringify(chatRoom));
                              chatRoomId = chatRoom.Id;
                              console.log('Id: ' + chatRoomId);
                          } else {
                              console.log('ChatRoom not found, creating new one ... ');
                             
                              // "After creating your item, the server will return the Id of the created item along with its Creation date."
                              chatRooms.create({ 'Participants': [otherUserId, currentUser.data.Id] },
                                 function (res) {
                                     console.log(JSON.stringify(res));
                                     chatRoomId = res.result.Id;
                                     console.log(res.result);
                                     console.log('New ChatRoom Id: ' + chatRoomId); // SUCCESS !!!
                                 },
                                 function (error) {
                                     console.log(JSON.stringify(error));
                                 });
                          }

                          var chatRoomViewModel = kendo.observable({
                              title: 'Chat with ' + otherUser.DisplayName
                          });
                          kendo.bind(e.view.element, chatRoomViewModel);
                      },
                      function (error) {
                          console.log(JSON.stringify(error));
                      });

                  });




        //var chatRooms = app.el.data('ChatRoom');

        //var currentCommonChatRoomQuery = new Everlive.Query();
        //currentCommonChatRoomQuery.where()
        //.isin(currentUser.data.Id, 'Participants')
        //.and()
        //.isin(otherUserId, 'Participants')

        //chatRooms.get(query)
        //.then(function (res) {
        //    console.log(res);



        //});

    };

    return {
        show: show
    }
}());