function onButtonClick() {
  log('Requesting any Bluetooth Device...');
  navigator.bluetooth.requestDevice({
   // filters: [...] <- Prefer filters to save energy & show relevant devices.
      acceptAllDevices: true,
      optionalServices: ['device_information']})
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    log('Getting Device Information Service...');
    return server.getPrimaryService('device_information');
  })
  .then(service => {
    log('Getting Device Information Characteristics...');
    return service.getCharacteristics();
  })
  .then(characteristics => {
    let queue = Promise.resolve();
    let decoder = new TextDecoder('utf-8');
    characteristics.forEach(characteristic => {
      
        queue = queue.then(_ => characteristic.readValue()).then(value => {
            log('Characteristic: ' + characteristic.uuid +
                decoder.decode(value));
          });

    });
    return queue;
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

/* Utils */

function padHex(value) {
  return ('00' + value.toString(16).toUpperCase()).slice(-2);
}

function getUsbVendorName(value) {
  // Check out page source to see what valueToUsbVendorName object is.
  return value +
      (value in valueToUsbVendorName ? ' (' + valueToUsbVendorName[value] + ')' : '');
}