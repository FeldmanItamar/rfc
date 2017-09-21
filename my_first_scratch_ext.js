var ArudinoBTconnect = ArudinoBTconnect || false;
var theArduinoBTDevice = theArduinoBTDevice || null;
var potentialDevices = [];
var device = null;


function timeStamp()
{
    return (new Date).toISOString().replace(/z|t/gi,' ').trim();
}

function console_log(str)
{
    console.log(timeStamp() + ": "  + str);
}

function setLED() {

    theArduinoBTDevice.send(1);
}
function unsetLED() {

    theArduinoBTDevice.send(0);
}

//data received from the Arduino
function receive_handler(data)
{
}

function tryToConnect()
{
    console_log("Trying to connect..." + theArduinoBTDevice);
    theArduinoBTDevice.open({ stopBits: 0, bitRate: 9600, ctsFlowControl: 0});
    theArduinoBTDevice.set_receive_handler(receive_handler);
    ArudinoBTconnect = true;
}
 
function tryNextDevice()
{
    potentialDevices.sort((function(a, b){return b.id.localeCompare(a.id)}));

    var device = potentialDevices.shift();
    
    console_log("tryNextDevice: " + device);

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
          
      //if ((dev.id.indexOf('/dev/tty.serial') === 0)) {  }
      
      potentialDevices.push(dev); 

       tryNextDevice();    
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
   ScratchExtensions.register('PicoBoard', descriptor, ext, {type: 'serial'});
})({});
