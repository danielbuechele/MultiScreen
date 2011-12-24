var sys = require("sys");
// Library https://github.com/miksago/node-websocket-server
var	websocket = require('./websocket/lib/ws/server');

// create web socket server
var server = websocket.createServer();
// listen on port 8078
server.listen(8078);

// when the server is ready
server.addListener("listening", function() {
  sys.log("Listening for connections on localhost:8078");
});

// when a traditional HTTP request comes
server.addListener("request", function(req, res) {
	res.writeHead(200, {
		"Content-Type" : "text/plain"
	});
	res.write("This is an example WebSocket server.");
	res.end();
});

// when a client websocket connects
server.addListener("connection", function(conn) {

	// when client writes something
	conn.addListener("message", function(message) {

		// iterate thorough all connected clients, and push this message
		server.manager.forEach(function(connected_client) {
			connected_client.write(JSON.stringify(message));
        });
	});
});

var fs = require('fs'),
    sys = require('sys');

var file = './0001.JPG';
fs.watchFile(file, function(curr, prev) {
    //sys.puts("prev: "+JSON.stringify(prev));
    //sys.puts("curr: "+JSON.stringify(curr));
    if (JSON.stringify(prev.nlink) == "0") {
        sys.puts("file created");
        server.manager.forEach(function(connected_client) {
			connected_client.write(JSON.stringify("created"));
        });
    }
});