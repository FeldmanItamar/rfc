var ArudinoBTconnect = ArudinoBTconnect || false;
var theArduinoBTDevice = theArduinoBTDevice || null;
var potentialDevices = [];
var device = null;
var test = test || false;


function timeStamp()
{
    return (new Date).toISOString().replace(/z|t/gi,' ').trim();
}

function console_log(str)
{
    console.log(timeStamp() + ": "  + str);
}

function setLED() {

    theArduinoBTDevice.send(new Uint8Array(1));
}
function unsetLED() {

    theArduinoBTDevice.send(new Uint8Array(0));
}

function tryToConnect()
{
    console_log("Trying to connect..." + theArduinoBTDevice.id);
    theArduinoBTDevice.open({ stopBits: 1, bitRate: 9600, ctsFlowControl: 0});
    
    theArduinoBTDevice.set_receive_handler(function(data) {
        var inputData = new Uint8Array(data);
        console_log(data + "|" + inputData);
      });
    
    
    ArudinoBTconnect = true;
}
 
function tryNextDevice()
{
    
 
    var device = potentialDevices.shift();
    
    console_log("tryNextDevice: " + device.id);

    if (!device)
        return;

    theArduinoBTDevice = device;
    
    tryToConnect();
    
}

(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function()  {
        
         if (!ArudinoBTconnect)
            return { status:1, msg:'Disconnected' };
         else
            return { status:2, msg:'Connected' };
     };
    
   
     ext._deviceConnected = function(dev) { 
            
      console_log('_deviceConnected: ' + dev.id);
          
      if ((dev.id == 'COM3')) {  
        if(!ArudinoBTconnect) {    
          potentialDevices.push(dev); 
          tryNextDevice();  
        }
      }
     }

    ext.setLED = function()
     {
        setLED();
     }
       ext.unsetLED = function()
     {
        unsetLED();
     }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [" ", "set LED",                                 "setLED",                 "green"],
            [" ", "unset LED",                               "unsetLED",               "green"],
              ]
    };

    var serial_info = {type: 'serial'};
   ScratchExtensions.register('itamar5', descriptor, ext, {type: 'serial'});
})({});
