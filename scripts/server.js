var net = require('net')
var terminal = require('child_process')

var server_IP = process.argv[2]
var server_port = process.argv[3]

var server = net.createServer(function (sock){
	sock.on('data', function(data){
		if(data.slice(0, 6) == "data: "){
			runWebpplScript(data, sock)
		}
	});
})

server.listen(server_port, server_IP) 
console.log("Server is listening...")

var runWebpplScript = function(data_obj_string, sock){
	data_obj_string = data_obj_string.slice(6)
	var dataString = ""
	data_obj = JSON.parse(data_obj_string)
	data_obj.n_data.forEach(function(datum){
		dataString = dataString + datum + " "
	})
	data_obj.m_data.forEach(function(datum){
		dataString = dataString + datum + " "
	})
	console.log("Executing webppl mcmc_active.wppl " + dataString)
	terminal.exec('webppl mcmc_active.wppl ' + dataString, function(error, stdout, stderr){
		if(error){
			console.error('exec error: ' + error);
			return;
		}
		sock.write(stdout);
		console.log(stdout);
	})
}
