 
(function(ext) {
 
 var potentialDevices = [];
 
  var device = null;
  var connected = false;

  function tryNextDevice() {
    device = potentialDevices.shift();
       console_log('tryNextDevice1: ' + device.id);

    if (!device) return;
    device.open({stopBits: 0, bitRate: 57600, ctsFlowControl: 0}, function() {
      device.set_receive_handler(function(data) {
        //processInput(new Uint8Array(data));
      });
    });
   
    console_log('tryNextDevice2: ' + device.id);

    connected = true;
    device.send("1");
       console_log('tryNextDevice3: ' + device.id);

    device.write_raw('2');
       console_log('tryNextDevice4: ' + device.id);
  
   if (dev.id == 'COM8') connected = true;
  }
 
 function timeStamp()
{
    return (new Date).toISOString().replace(/z|t/gi,' ').trim();
}

function console_log(str)
{
    console.log(timeStamp() + ": "  + str);
}

  function pingDevice() {
   console_log("in ping");
    device.send('a');
  }


  ext.analogWrite = function(pin, val) {
    analogWrite(pin, val);
  };

  ext.digitalWrite = function(pin, val) {
    if (val == 'on')
      digitalWrite(pin, HIGH);
    else if (val == 'off')
      digitalWrite(pin, LOW);
  };

  ext._deviceConnected = function(dev) {
   if(!connected) {
    console_log('_deviceConnected: ' + dev.id);
    potentialDevices.push(dev);
    if (!device) tryNextDevice();
   }
  };

  ext._deviceRemoved = function(dev) {
    console.log('device removed');
    pinModes = new Uint8Array(12);
    if (device != dev) return;
    device = null;
  };

  ext._shutdown = function() {
    // TODO: Bring all pins down
    if (device) device.close();
    device = null;
  };

ext.test = function() {
   pingDevice();
  };
  
  var blocks = [
      ['a', 'test', 'test', 13, 'on'],
  ];

 
  var descriptor = {
    blocks: blocks,
  };

  ScratchExtensions.register('test6', descriptor, ext, {type: 'serial'});
})({});
