const { ipcMain, ipcRenderer } = require('electron');
const sp = require('serialport')



function reset() {
  document.getElementById('mySelect').innerText = null;
}

async function listSerialPorts() {
  var x = document.getElementById("mySelect");
  var option = document.createElement("option");
  reset()
  await sp.SerialPort.list().then (
    ports => ports.forEach(port => option.text = port.path),
    err => console.log(err),
    x.add(option)
  )
}

  function launch() {
    var com = document.getElementById("mySelect").value;
    var baud = document.getElementById("rate").value;
    ipcRenderer.send('launch', `${com}`, `${baud}`)
}

document.getElementById('clickme').addEventListener('click', listSerialPorts)
document.getElementById('launch').addEventListener('click', launch)

