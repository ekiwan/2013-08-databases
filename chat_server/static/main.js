$(document).ready(function() {
  var user;
  var userMessage;
  var friends = {};
  var room = {};

  $.ajax('http://127.0.0.1:8080/1/classes/messages', {
    contentType: 'application/json',
    success: function(data){
      mostRecent = data.results[0].createdAt;
      _.each(data.results, function(userData) {
        var username = userData.username || 'visitor';
        var date = moment(userData.createdAt).fromNow();
        var message = username + ': ' + userData.text + ', ' + date;

        if (userData.hasOwnProperty('roomname')) {
          room[userData.roomname] = userData.roomname;
        }

        $('#messages').append($('<div class="messageContainer"/>').data('username', username).text(message));
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

  var selectFriends = function() {
    $.each($('.messageContainer'), function(index, el) {
      if (friends[$(el).data().username]) {
        $(this).wrap('<strong/>');
      }
    });
  };

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
        var message = username + ': ' + userData.text + ', ' + date;

        if (userData.hasOwnProperty('roomname')) {
          if (userData['roomname'] === roomname) {
             $('#messages').append($('<div class="messageContainer"/>').text(message));
          }
        }
      });
    });
  };

});
