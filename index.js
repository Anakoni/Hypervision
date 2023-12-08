const sp = require('serialport');
const express = require('express');
var createInterface = require('readline').createInterface;
var http = require('http').Server(express);
var io = require('socket.io')(http);


const app = express();


console.log(`
       ██████╗ ██████╗ ███████╗    ██╗  ██╗███████╗██╗     ██╗ ██████╗ ███████╗
      ██╔════╝ ██╔══██╗██╔════╝    ██║  ██║██╔════╝██║     ██║██╔═══██╗██╔════╝
      ██║  ███╗██████╔╝███████╗    ███████║█████╗  ██║     ██║██║   ██║███████╗
      ██║   ██║██╔═══╝ ╚════██║    ██╔══██║██╔══╝  ██║     ██║██║   ██║╚════██║
      ╚██████╔╝██║     ███████║    ██║  ██║███████╗███████╗██║╚██████╔╝███████║
       ╚═════╝ ╚═╝     ╚══════╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚══════╝
`)
 
// list serial ports:
sp.SerialPort.list().then (
  ports => ports.forEach(port =>console.log(port.path)),
  err => console.log(err)
)

//open serial port
const port = new sp.SerialPort({
  path: 'COM3',
  baudRate: 9600,
  autoOpen: true,
})


//read line
var lineReader = createInterface({
  input: port
});

lineReader.on('line', function (line) {
  let gps = JSON.parse(line.toString())
  let position = (gps.Lat, gps.Long)

  io.emit('position', position);

// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message)
})

});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/main.html');
});
app.listen(5000, () => { 
  console.log('App listening on port 5000'); 
}); 
