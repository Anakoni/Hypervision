const { app, BrowserWindow, ipcMain } = require('electron')
const sp = require('serialport')
const path = require('path')
const url = require('url')
const express = require('express');
var http = require('http').Server(express);
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { Console } = require('console');
var createInterface = require('readline').createInterface;
const { join } = require('node:path');
const appli = express();
const server = createServer(appli);
const socio = new Server(server);
const nmea = require("nmea-simple");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, // to allow require
            contextIsolation: false, // allow use with Electron 12+
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    
    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    app.quit()
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function launch(com, rate)
 {
  console.log(rate)
  const port = new sp.SerialPort({
    path: com,
    baudRate: Math.floor(rate),
  })
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
    res.sendFile(__dirname + '/gps.html');
  });
  
  server.listen(5000, () => { 
  
    console.log('App listening on port 5000'); 
  })


  mainWindow.loadURL("http://localhost:5000")
}

ipcMain.on('launch', (event, com, rate) => {
  launch(com, rate)
})