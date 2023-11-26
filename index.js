const sp = require('serialport');
 
// list serial ports:
sp.SerialPort.list().then (
  ports => ports.forEach(port =>console.log(port.path)),
  err => console.log(err)
)

//open serial port
const port = new sp.SerialPort({
  path: 'COM1',
  baudRate: 9600,
  autoOpen: true,
})

//send message to the port 
port.write('Test communication c++/NodeJS', function(err) {
  if (err) {
    return console.log('Error on write: ', err.message)
  }
  console.log('message written')
})

//needs debug
port.on('readable', function () {
  console.log('Data:', port.read())
})

// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message)
})