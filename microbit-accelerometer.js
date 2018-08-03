

/* define Parameters **************************************************************/
const DEVICE_NAME_PREFIX = 'BBC micro:bit';
const ACCELEROMETERSERVICE_SERVICE_UUID = 'e95d0753-251d-470a-a062-fa1922dfa9a8';
const ACCELEROMETERDATA_CHARACTERISTIC_UUID = 'e95dca4b-251d-470a-a062-fa1922dfa9a8';
// Messages
const MSG_CONNECTED = 'Connected';
const MSG_CONNECT_ERROR = 'Failed to Conect';
const MSG_DISCONNECTED = 'Disconnected';
/*********************************************************************************/
// for connection process
const SERVICE_UUID = ACCELEROMETERSERVICE_SERVICE_UUID;
const CHARACTERISTIC_UUID = ACCELEROMETERDATA_CHARACTERISTIC_UUID;
// connected device value
var connectDevice;

var microbit = {};
microbit.accelerometer = {};

// disconnect process
microbit.disconnect = function() {
  if (!connectDevice || !connectDevice.gatt.connected) return;
  connectDevice.gatt.disconnect();
  alert(MSG_DISCONNECTED);
  //postDisconnect();
};

// connect process
microbit.connect = async function () {
  try {
    let device = await navigator.bluetooth.requestDevice({
      filters: [{
        namePrefix: DEVICE_NAME_PREFIX
      }],
      optionalServices: [SERVICE_UUID]
    });
  
    connectDevice = device;
    console.log('device', device);
  
    let server = await device.gatt.connect();
    console.log('server', server);
  
    let service = await server.getPrimaryService(SERVICE_UUID);
    startService(service, CHARACTERISTIC_UUID); // start service
    
  } catch(error) {
    console.log(error);
    alert(MSG_CONNECT_ERROR);
  }
};

// start service event
async function startService (service, charUUID) {
  try {
    let characteristic = await service.getCharacteristic(charUUID);
    let char = characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged',
      // event is here
      onAccelerometerValueChanged);
    console.log('Accelerometer:', char);
  } catch(error) {
    console.log(error);
    alert(MSG_CONNECT_ERROR);
  }
}

// event handler
function onAccelerometerValueChanged (event) {
  microbit.accelerometer.x = event.target.value.getInt16(0,true) / 1000.0;
  microbit.accelerometer.y = event.target.value.getInt16(2,true) / 1000.0;
  microbit.accelerometer.z = event.target.value.getInt16(4,true) / 1000.0;
}
