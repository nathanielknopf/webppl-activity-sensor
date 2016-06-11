<h1>Activity Sensor for Raspberry Pi and Arduino using webppl</h1>

<p>This is a simple embedded device using a noise sensor and two PIR motion sensors on an Arduino connected to a Raspberry Pi running a webppl script. The device determines whether or not there are (active) people within the proximity of the sensors using a webppl model.</p>

<h2>Running the Device</h2>

<p>There are two main ways to run the device. Once the device has been set up with the Arduino plugged into the Raspberry Pi, the Raspberry Pi can either run the webppl scripts locally, or export data to a server on the local network which will run the webppl script more quickly.</p>

<p>To run the webppl scripts locally, run the serialmanager.js file like so:
"$ node serialmanager.js <serial port of Arduino>"</p>

<p>To run them on a server, first run the server.js file on your desired server computer, like so:
"$ node server.js <server's local IP address> <port>"
Then run the client.js script on the Raspberry Pi like so:
"$ node client.js <serial port of Arduino> <server's local IP address> <port>"
</p>
