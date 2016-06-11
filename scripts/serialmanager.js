var serialport = require("node-serialport"); 
var SerialPort = serialport.SerialPort;
var terminal = require('child_process'); 

var port = process.argv[2]
var baud_rate = 9600
var delay = 30000

var data_array = []

var arduino_port = new SerialPort(port, {
	baudrate: baud_rate,
	parser: serialport.parsers.readline("\n")
})

arduino_port.on('open', function(){
	console.log("Opened port...")
})

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
	var data_string = ""
	console.log(data_array.length)
	if(data_array.length == 80){
		for(element in data_array){
			data_string = data_string + data_array[element] + ' '
		}
		console.log(data_string)	
		console.log("Running webppl script with " + data_array.length + " elements...")
		terminal.exec('webppl mcmc_active.wppl ' + data_string, function(error, stdout, stderr){
			if(error){
				console.error('exec error: ' + error);
				return;
			}
			console.log(stdout);
		})
	}	
}, delay)
