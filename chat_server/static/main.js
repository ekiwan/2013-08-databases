$(document).ready(function() {
  var user;
  var userMessage;
  var friends = {};
  var room = {};

  $.ajax('http://127.0.0.1:8080/1/classes/messages', {
    contentType: 'application/json',
    success: function(data){
      console.log(data);
      mostRecent = data.results[0].createdAt;
      _.each(data.results, function(userData) {
        var msgData = JSON.parse(userData);
        var username = msgData.username || 'visitor';
        var date = moment(msgData.createdAt).fromNow();
        var message = msgData.body;

        if (msgData.hasOwnProperty('roomname')) {
          room[msgData.roomname] = msgData.roomname;
        }

        var mainMsgDiv = $('<div></div>').attr('class', 'message');
        var usernameDiv = $('<div></div>').attr('class', 'username').text(username).appendTo(mainMsgDiv);
        var createdAtDiv = $('<div></div>').attr('class', 'createdAt').text(date).appendTo(mainMsgDiv);
        var messageDiv = $('<div></div>').attr('class', 'mainText').text(message).appendTo(mainMsgDiv);

        $('#messages').append(mainMsgDiv);
      });
      setUpFriends();
      showRooms();
      setUpRooms(data);
    },
    error: function(data) {
      console.log('Ajax request failed </3');
    }
  });

  $('#chatbutton').on('click', function() {
    user = $('#userForm').val();
    userMessage = $('#inputmessage').val();
    var data = messageData(user, userMessage);
    console.log(data);
    postMessage(data);
  });

  var messageData = function(username, message){
    var result = {};
    result.username = username;
    result.text = message;
    return result;
  };

  var postMessage = function(messageData){
    $.ajax('http://127.0.0.1:8080/1/classes/messages', {
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(messageData),
      success: function(){
        console.log('Success!!!');
      }
    });
  };

  var setUpFriends = function() {
    $('.messageContainer').on('click', function() {
      var dataAttr = $(this).data().username;
      friends[dataAttr] = dataAttr;
      selectFriends();
    });
  };


  $("body").on("click", ".username", function() {
      var username = $(this).text();
      $.ajax('http://127.0.0.1:8080/1/friends', {
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
          name: username
        }),
        success: function(){
          console.log('we are friends');
        }
      });
  });


  var showRooms = function() {
    _.each(room, function(val, key) {
      $('#roomContainer').append($('<div class="roomname" />').data('room', key).text(val));
    });
  };

  var setUpRooms = function(data) {
    $('.roomname').on('click', function() {
      var roomname = $(this).data().room;

      $('#messages').html('');
      _.each(data.results, function(userData) {
        var username = userData.username || 'visitor';
        var date = moment(userData.createdAt).fromNow();
        var message = '<span class =' + username + '>' + username + '</span>:'   + userData.text + ', ' + date;

        if (userData.hasOwnProperty('roomname')) {
          if (userData['roomname'] === roomname) {
             $('#messages').append($('<div class="messageContainer"/>').text(message));
          }
        }
      });
    });
  };

});
