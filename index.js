const sp = require('serialport');
const express = require('express');
var createInterface = require('readline').createInterface;
var http = require('http').Server(express);
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const { app, BrowserWindow } = require('electron')
const appli = express();
const server = createServer(appli);
const socio = new Server(server);
const nmea = require("nmea-simple");

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
  path: "COM6",
  baudRate: 38400,
  autoOpen: true,
})


//read line
var lineReader = createInterface({
  input: port
});


lineReader.on('line', function (line) {
  const packet = nmea.parseNmeaSentence(line);


        if (packet.sentenceId === "GGA" && packet.fixType !== "none") {
            console.log("Got location via GGA packet:", packet.latitude, packet.longitude);
        }
        socio.emit('position', { lat: packet.latitude, long: packet.longitude});

// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message)
})

});

appli.get('/', function(req, res) {
  res.sendFile(__dirname + '/main.html');
});

server.listen(5000, () => { 

  console.log('App listening on port 5000'); 
}); 

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadURL('http://localhost:5000')

}


app.whenReady().then(() => {
  createWindow()
  
  
});




