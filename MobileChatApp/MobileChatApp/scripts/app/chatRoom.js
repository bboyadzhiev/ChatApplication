/**
 * ChatRoom model 
 */
var other;
var app = app || {};

app.ChatRoom = (function () {
    'use strict';
    var chatRoomViewModel;
    var currentUrl;
    var currentUser;
    var currentUserLocation;
    

    var show = function (e) {

        navigator.geolocation.getCurrentPosition(function (position) {
            currentUserLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        }, function (error) {
            console.log(error.message);
            currentUserLocation = {
                latitude: 0,
                longitude: 0
            }
        });
        var chatRoom;
        var newMessageText;
        console.log(window.location);
        console.log(other);

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

      //  var otherUserId = first;
        var otherUserId = other;
        console.log('This User ID:' + currentUser.data.Id); // LOG
        console.log('Other User ID: ' + otherUserId); // LOG
        if (otherUserId == null) {
            console.log(currentUrl);
            throw 'user id not found!';
        }

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
                      .isin('Participants', [currentUser.data.Id]);
                     
                     //.eq('Participants', [currentUser.data.Id, otherUserId] || [otherUserId, currentUser.data.Id]);
                     // .isin('Participants', [otherUserId]);
                     // .and()
                      //.eq('Participants', [otherUserId, currentUser.data.Id])
                     // .or()
                     // .and()
                     // .eq('Participants', [currentUser.data.Id, otherUserId]);

                      console.log('Checking for existing chatroom ... ');// LOG
                      var chatRooms = app.el.data('ChatRoom');
                      chatRooms.get(currentCommonChatRoomQuery)
                      .then(function (res) {
                          var found = false;
                          if (res.result.length > 0) {
                              for (var i = 0; i < res.result.length; i++) {//DEBUG
                                 
                                  console.log('ChatRooms found: ');        //DEBUG
                                  console.log('Id: ' + res.result[i].Id);  //DEBUG
                                  console.log(res.result[i]);   //DEBUG
                                  console.log('Prts Ids:')
                                  console.log(res.result[i].Participants[0]);
                                  console.log(res.result[i].Participants[1]);
                                  if (res.result[i].Participants[0] == currentUser.data.Id && res.result[i].Participants[1] == otherUserId) {
                                      chatRoom = res.result[i];
                                      console.log('ChatRoom binded - ');
                                      found = true;
                                      chatRoomId = chatRoom.Id;
                                  }

                                  if (res.result[i].Participants[0] == otherUserId && res.result[i].Participants[1] == currentUser.data.Id) {
                                      chatRoom = res.result[i];
                                      console.log('ChatRoom binded + ');
                                      found = true;
                                      chatRoomId = chatRoom.Id;
                                  }
                                  if (found == true) {
                                      break;
                                  }
                              }

                           //   chatRoom = res.result[0];
                           //   console.log('ChatRoom found: ');
                              
                           //   console.log('Id: ' + chatRoomId);// LOG
                          } 

                          if (found == false){
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
                              messagesQuery.orderDesc('CreatedAt');;
                              
                              console.log('Checking for messages for this ChatRoom'); // LOG
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
                                       //   var creatorUserLocation;
                                          if (chatRoomMessages[i].CreatedBy == currentUser.data.Id) {
                                              creatorUserName = currentUser.data.DisplayName;
                                           //   creatorUserLocation = currentUser.data.Geolocation;
                                          } else {
                                              creatorUserName = otherUser.DisplayName;
                                           //   creatorUserLocation = otherUser.Geolocation;
                                          }

                                          messagesModel.push({
                                              text: chatRoomMessages[i].Text,
                                              creatorName: creatorUserName,
                                              createdAt: chatRoomMessages[i].CreatedAt,
                                              location: chatRoomMessages[i].SenderLocation

                                          });
                                      }
                                     console.log('USER LOCATION: ');
                                     console.log(currentUserLocation);

                                      chatRoomViewModel = kendo.observable({            // EXISTING MESSAGE MODEL
                                         // title: 'Chat with ' + otherUser.DisplayName, 
                                          title: otherUser.DisplayName,                 
                                          messages: messagesModel,                       
                                          newMessageText: '',
                                          CreatedBy: currentUser.data.Id,
                                          ChatRoom: chatRoomId,
                                          SendTo: otherUserId,
                                          SenderLocation: currentUserLocation
                                      });                                              
                                      kendo.bind(e.view.element, chatRoomViewModel);    // EXISTING MESSAGE MODEL
                                     
                                  } else {
                                      console.log('No messages yet'); // LOG
                                      chatRoomViewModel = kendo.observable({           // NO MESSAGES MODEL
                                          title: otherUser.DisplayName,  
                                          messages: {                                  
                                              text: 'No messages yet',                                
                                          createdAt: '',             
                                          location: currentUser.data.Geolocation
                                          },                                     
                                          newMessageText: '',
                                          CreatedBy: currentUser.data.Id,
                                          ChatRoom: chatRoomId,
                                          SendTo: otherUserId
                                      });                                               
                                      kendo.bind(e.view.element, chatRoomViewModel);    // NO MESSAGES MODEL
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
        console.log('Sending message:'); // LOG
        console.log(JSON.stringify(chatRoomViewModel)); // LOG


        var messages = app.el.data('Messages');
        messages.create({
            'SendTo': chatRoomViewModel.SendTo,
            'ChatRoom': chatRoomViewModel.ChatRoom,
            'CreatedBy': chatRoomViewModel.CreatedBy,
            'Text': chatRoomViewModel.newMessageText,
            'SenderLocation': currentUserLocation
        }, function (res) {
           
            console.log(currentUrl); // LOG
            // $('#messagesContainer').load();
            
            app.mobileApp.navigate('views/onlineContactsView.html');
        }, function (error) {
            console.log(JSON.stringify(error));// LOG
        });
    }

    return {
        show: show,
        send: send
    }
}());