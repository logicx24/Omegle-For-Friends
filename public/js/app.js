var socket = io('localhost:3000');

$('#messageF').submit(function () {
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  event.preventDefault();
  return false;
});

socket.on('chat message', function (msg) {
	$('#messages').append($('<li>').text(msg));
});

socket.on('disconnect', function (msg) {
	$('#messages').append($('<li>').text(msg));
});

$(function(){
	var socket = io.connect();
	$('#nicksend').submit(function(e){
		e.preventDefault();
		var nick = $('#nick').val();
		socket.emit('nickname', nick, function(err){
			if (!err) {
				$('#nick-container').hide();
				$('#chat-container').show();
			}
			//$('#nick-error').html(err);
		});
	});

	socket.on('updatedNicks', function(data){
		var text = '';
		for (var i = 0; i < data.length; i++) {
			text += '<li class="user">' + data[i] + '</li>';
		}
		$('#users').html(text);
	});
});
