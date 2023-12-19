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
  let g1 = (`${gps.Lat}`).toString()
  let g2 = (`${gps.Long}`).toString()
  let g3 = (`${gps.Prec}`).toString()
  let position = (g1+ ", "+ g2 + ", "+g3)
  
  //console.log(position);

  socio.emit('position', { lat: g1, long: g2, prec: g3 });


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




