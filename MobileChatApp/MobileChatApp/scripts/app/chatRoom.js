/**
 * ChatRoom model 
 */

var app = app || {};

app.ChatRoom = (function () {
    'use strict';
    var chatRoomViewModel;
    var currentUrl;
    //app.el.Users.load;
    var show = function (e) {

        var currentUser;
        var chatRoom;
        var newMessageText;


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
        currentUrl = 'views/chatRoomView.html?id=' + first;

        console.log('chatRoom.js'); // LOG
        currentUser = app.Users.currentUser;
        var otherUser;
        var chatRoomId;

        var otherUserId = first;
        console.log('This User ID:' + currentUser.data.Id); // LOG
        console.log('Other User ID: ' + otherUserId); // LOG

        var users = app.el.data('Users');
        users.getById(otherUserId)
            .then(function (resultUser) {
                // Contact found
                otherUser = resultUser.result;
                console.log('Other User Found: ' + otherUser.DisplayName);// LOG
            },
            function (error) {
                // Contact not found
                console.log(JSON.stringify(error));
            })
                  .then(function () {
                      // Find or create the ChatRoom
                      // First checks if there is a ChatRoom, containing both currentUser and otherUser as part of ChatRoom.Participants
                      var currentCommonChatRoomQuery = new Everlive.Query();
                      currentCommonChatRoomQuery.where()
                      .isin('Participants', [otherUserId, currentUser.data.Id]);
                      //.isin(currentUser.data.Id, 'Participants')
                      //.and()
                      console.log('Checking for existing chatroom ... ');// LOG
                      var chatRooms = app.el.data('ChatRoom');
                      chatRooms.get(currentCommonChatRoomQuery)
                      .then(function (res) {
                          if (res.result.length > 0) {
                              chatRoom = res.result[0];
                              console.log('ChatRoom found: ');
                              console.log(JSON.stringify(chatRoom));// LOG
                              chatRoomId = chatRoom.Id;
                              console.log('Id: ' + chatRoomId);// LOG
                          } else {
                              console.log('ChatRoom not found, creating new one ... ');

                              // "After creating your item, the server will return the Id of the created item along with its Creation date."
                              chatRooms.create({ 'Participants': [otherUserId, currentUser.data.Id] },
                                 function (res) {
                                     console.log(JSON.stringify(res));
                                     chatRoomId = res.result.Id;
                                     console.log(res.result);// LOG
                                     console.log('New ChatRoom Id: ' + chatRoomId); // LOG
                                 },
                                 function (error) {
                                     console.log(JSON.stringify(error));
                                 });
                          }


                      },
                      function (error) {
                          console.log(JSON.stringify(error));
                      })
                          .then(function (res) {
                              // Gets all messages where Messages.ChatRoom = this ChatRoom.Id
                              var messagesQuery = new Everlive.Query();
                              messagesQuery.where()
                                .eq('ChatRoom', chatRoom.Id);

                              console.log('Checking for messages for this ChatRoom');
                              var messages = app.el.data('Messages');
                              messages.get(messagesQuery)
                              .then(function (res) { // returns the found messages
                                  var chatRoomMessages;

                                  if (res.result.length > 0) {
                                      chatRoomMessages = res.result;
                                      console.log('Found messages:'); // LOG
                                      console.log(JSON.stringify(chatRoomMessages)); // LOG

                                      var messagesModel = new Array();
                                      for (var i = 0; i < chatRoomMessages.length; i++) {
                                          var creatorUserName;
                                          var creatorUserLocation;
                                          if (chatRoomMessages[i].CreatedBy == currentUser.data.Id) {
                                              creatorUserName = currentUser.data.DisplayName;
                                              creatorUserLocation = currentUser.data.Geolocation;
                                          } else {
                                              creatorUserName = otherUser.DisplayName;
                                              creatorUserLocation = otherUser.Geolocation;
                                          }

                                          messagesModel.push({
                                              text: chatRoomMessages[i].Text,
                                              creatorName: creatorUserName,
                                              createdAt: chatRoomMessages[i].CreatedAt,
                                              location: creatorUserLocation

                                          });
                                      }

                                      chatRoomViewModel = kendo.observable({            // EXISTING MESSAGE MODEL
                                          title: 'Chat with ' + otherUser.DisplayName,  // EXISTING MESSAGE MODEL
                                          messages: messagesModel,                       // EXISTING MESSAGE MODEL
                                          newMessageText: '',
                                          CreatedBy: currentUser.data.Id,
                                          ChatRoom: chatRoomId,
                                          SendTo: otherUserId
                                      });                                               // EXISTING MESSAGE MODEL
                                      kendo.bind(e.view.element, chatRoomViewModel);    // EXISTING MESSAGE MODEL

                                  } else {

                                      chatRoomViewModel = kendo.observable({            // EXISTING MESSAGE MODEL
                                          title: 'Chat with ' + otherUser.DisplayName,  // EXISTING MESSAGE MODEL
                                          messages: {                                   // NO MESSAGES MODEL
                                              text: 'No messages yet',                                 // NO MESSAGES MODEL
                                          creatorName: '',           // NO MESSAGES MODEL
                                          createdAt: ''             // NO MESSAGES MODEL
                                          },                                     // NO MESSAGES MODEL
                                          newMessageText: '',
                                          CreatedBy: currentUser.data.Id,
                                          ChatRoom: chatRoomId,
                                          SendTo: otherUserId
                                      });                                               // EXISTING MESSAGE MODEL
                                      kendo.bind(e.view.element, chatRoomViewModel);    // EXISTING MESSAGE MODEL

                              
                                  }
                              },
                                    function (error) {
                                        console.log(JSON.stringify(error));// LOG
                                    });

                          },
                            function (error) {
                                console.log(JSON.stringify(error));// LOG
                            });

                  });


    };

    var send = function (e) {
        console.log('Sending message:');
        console.log(JSON.stringify(chatRoomViewModel));


        var messages = app.el.data('Messages');
        messages.create({
            'SendTo': chatRoomViewModel.SendTo,
            'ChatRoom': chatRoomViewModel.ChatRoom,
            'CreatedBy': chatRoomViewModel.CreatedBy,
            'Text': chatRoomViewModel.newMessageText
        }, function (res) {
            //console.log(JSON.stringify(res));
            chatRoomViewModel.title = 'Message Sent';
            // app.mobileApp.navigate(currentUrl);
            console.log(currentUrl);
            $('#messagesContainer').load();

        }, function (error) {
            console.log(JSON.stringify(error));// LOG
        });
    }

    return {
        show: show,
        send: send
    }
}());