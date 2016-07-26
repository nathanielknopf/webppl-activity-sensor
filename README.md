#Activity Sensor for Raspberry Pi and Arduino using webppl

##About
This is a simple embedded device using a noise sensor and two PIR motion sensors on an Arduino connected to a Raspberry Pi running a webppl script. The device determines whether or not there are (active) people within the proximity of the sensors using a webppl model.

##Running the device

There are two main ways to run the device. Once the device has been set up with the Arduino plugged into the Raspberry Pi, the Raspberry Pi can either run the webppl scripts locally, or export data to a server on the local network which will run the webppl script more quickly.

####Locally
To run the webppl scripts locally, run the serialmanager.js file like so:
`node serialmanager.js (serial port of Arduino)`

####With Server
To run them on a server, first make sure that there is a copy of the activity_mcmc.wppl script in the same folder as the server.js script on the server computer. Then run the server.js file on your desired server computer, like so:
`$ node server.js (Server's IP Address) (Port server should listen on)`
Then run the client.js script on the Raspberry Pi like so:
`$ node client.js (Serial port of Arduino) (Server's IP address) (Port server is listening on)`

##Help
Please email knopf@mit.edu with any questions about this repo
