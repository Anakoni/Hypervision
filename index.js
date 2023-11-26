const sp = require('serialport');
 
// list serial ports:
serialport.SerialPort.list().then (
  ports => ports.forEach(port =>console.log(port.path)),
  err => console.log(err)
)