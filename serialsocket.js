var SerialPort = require("serialport");
var port = new SerialPort("/dev/ttyACM0", { 
	baudRate : 19200,
	parser: SerialPort.parsers.readline(')')
});



var WebSocketServer = require('ws').Server;
var SERVER_PORT = 8081;
var wss = new WebSocketServer({port: SERVER_PORT});
var connections = new Array;


wss.on('connection', handleConnection);

function handleConnection(client) {
	console.log('handleConnection() is invoked');
	console.log("New Connection");
	connections.push(client);
	client.on('message', sendToSerial);
	client.on('close', function() {
		console.log("connection closed");
		var position = connections.indexOf(client);
		connections.splice(position,1);
	});
}

function sendToSerial(data) {
	console.log("sending to serial: " + data);
	//myPort.write(data);
}

function broadcast(data) {
	console.log('broadcast() is invoked');
	for(myConnection in connections) {
		connections[myConnection].send(data);
	}
}

function saveLatestData(data) {
	console.log('saveLatestData() is invoked');
	console.log(data);
	if(connections.length > 0 ) {
		broadcast(data);
	}
}



port.on('open', function() {
	port.write('main screen turn on', function(err) {
		if(err) {
			return console.log('Error on  write: ', err.message);
		}
		console.log('message written');
	});
});

port.on('error', function(err) {
	console.log('Error: ', err.message);
});


port.on('data', function(data){
	console.log('Data: ' + data);
	broadcast(data);
});
