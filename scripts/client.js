var serialport = require("node-serialport"); 
var SerialPort = serialport.SerialPort;
var terminal = require('child_process'); 
var net = require('net')

//serial communications with arduino settings
var port = process.argv[2]
var baud_rate = 9600
var delay = 15000
var server_IP = process.argv[3]
var server_port = process.argv[4]

//Configure server/client for sending data for webppl script
var client = new net.Socket()

client.connect(server_port, server_IP, function() {
	console.log('Connected')
	// client.write('Connection from client.')
})

client.on('close', function(){
	console.log('Connection closed.')
})

client.on('data', function(data){
	console.log('Received data: ' + data)
})

var sendData = function(client, noise_data, motion_data, close_after_writing){
	var data_obj = {
		n_data: noise_data,
		m_data: motion_data
	}
	client.write("data: " + JSON.stringify(data_obj))
	console.log("Sent data...")
	if(close_after_writing){
		client.end()
	}
}

//serial communication
var arduino_port = new SerialPort(port, {
	baudrate: baud_rate,
	parser: serialport.parsers.readline("\n")
})

arduino_port.on('open', function(){
	console.log("Opened port...")
})

var data_array = []

arduino_port.on('data', function(data){
	data_array.push(data.slice(0, -1))
})

setInterval(function(){
	arduino_port.write('a', function(err){
		if(err){
			console.log('Error: ' + err.message)
		}
	})
	data_array = data_array.slice(-80)
	console.log(data_array.length)
	if(data_array.length == 80){
		var noise_data = data_array.slice(0, 40)
		var motion_data = data_array.slice(40)
		console.log("Sending " + data_array.length + " items of data to webppl server...")
		sendData(client, noise_data, motion_data, false)
	}	
}, delay)



