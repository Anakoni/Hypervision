const sp = require('serialport');

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
  let data = port.read()
  console.log(data.toString())
})

//ratio + don't care + didn't ask
let data = '{"Lat" : 47.65452412387142, "Long" : -2.0819485602849377}'
 let gps = JSON.parse(data)

 console.log("Latitude = " + gps.Lat)
 console.log("Longitude = " + gps.Long)


// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message)
})
