var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
//app.use(require("connect-assets")());

nicknames = {};
used_names = [];


app.set('port', process.env.PORT || 3000);

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(cookieParser());
// app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/app.html');
});

io.on('connection', function (socket) {
	nickChoose(socket);
	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	});
	socket.on('disconnect', function () {
		io.emit('disconnect msg', 'A user logged off');
	});
});

var nickChoose = function(socket) {
	socket.on('nickname', function (nick, callback) {
		if (used_names.indexOf(nick) != -1) {
			callback('Sorry, your name has been taken already.');
			return;
		}
		callback(null);
		nicknames[socket.id] = nick;
		used_names.push(nick);
		socket.emit('updatedNicks', used_names);
	})
}


http.listen(app.get('port'), function() {
  console.log('HTTP server listening on port %d in %s mode', app.get('port'), app.get('env'));
});


module.exports = app;
