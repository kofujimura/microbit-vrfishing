/* define Parameters **************************************************/
const DEVICE_NAME_PREFIX = 'BBC micro:bit';
const MAGNETOMETER_SERVICE_UUID = 'e95df2d8-251d-470a-a062-fa1922dfa9a8';
const    MAGNETOMETER_DATA_UUID = 'e95dfb11-251d-470a-a062-fa1922dfa9a8';
const  MAGNETOMETER_PERIOD_UUID = 'e95d386c-251d-470a-a062-fa1922dfa9a8';
const MAGNETOMETER_COMPASS_UUID = 'e95d9715-251d-470a-a062-fa1922dfa9a8';
// Messages
const MSG_CONNECTED = 'Connected';
const MSG_CONNECT_ERROR = 'Failed to Connect';
const MSG_DISCONNECTED = 'Disconnected';
/**********************************************************************/
// request connect  UUID
const SERVICE_UUID = MAGNETOMETER_SERVICE_UUID;
const CHARACTERISTIC_UUID_1 = MAGNETOMETER_PERIOD_UUID;
const CHARACTERISTIC_UUID_2 = MAGNETOMETER_COMPASS_UUID;
// compass read interval mS
const INTERVAL = 250;
// connected device value
var connectDevice;

// disconnect process
function disconnect () {
  if (!connectDevice || !connectDevice.gatt.connected) return;
  connectDevice.gatt.disconnect();
  //alert(MSG_DISCONNECTED)
  postDisconnect();
}

// post disconnect process is here
function postDisconnect () {
  //document.js.compass.value = ''
}

// connect process
function connect () {
  navigator.bluetooth.requestDevice({
    filters: [{
      namePrefix: DEVICE_NAME_PREFIX
    }],
    optionalServices: [SERVICE_UUID]
  })
    .then(device => {
      connectDevice = device;
      console.log('device', device);
      return device.gatt.connect();
    })
    .then(server => {
      console.log('server', server);
      server.getPrimaryService(SERVICE_UUID)
        .then(service => {
          // start service is here
          setPeriod(service, CHARACTERISTIC_UUID_1); // set interval timer
          startService(service, CHARACTERISTIC_UUID_2); // start commpass
        });
    })
    .catch(error => {
      console.log(error);
      //alert(MSG_CONNECT_ERROR)
    });
}

// set interval timer
function setPeriod (service, charUUID) {
  service.getCharacteristic(charUUID)
    .then(characteristic => {
      characteristic.writeValue(new Uint16Array([INTERVAL]));
    })
    .catch(error => {
      console.log(error);
      //alert(MSG_CONNECT_ERROR)
    });
}

// start service event
function startService (service, charUUID) {
  service.getCharacteristic(charUUID)
    .then(characteristic => {
      characteristic.startNotifications()
        .then(char1 => {
          //alert(MSG_CONNECTED)
          characteristic.addEventListener('characteristicvaluechanged',
            // event is here
            onCompassChanged);
          console.log('Compass:', char1);
        });
    })
    .catch(error => {
      console.log(error);
      //alert(MSG_CONNECT_ERROR)
    });
}

// event handler
function onCompassChanged (event) {
  let bearing = event.target.value.getUint16(0, true);
  // updateBearingValue(bearing)
  console.log('Heading:' + bearing);
  AcceleratorX = bearing;
  //let direction = document.createTextNode(bearing);
  //let brtag = document.createElement("br");
  //elm.appendChild(direction);
  //elm.appendChild(brtag);
  //document.js.compass.value = bearing
}
