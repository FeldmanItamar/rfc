var ArudinoBTconnect = ArudinoBTconnect || false;
var theArduinoBTDevice = theArduinoBTDevice || null;
var potentialDevices = [];
var device = null;
var test = test || false;
var counter = counter || 0;

function packMessageForSending(str)
{
    var length = ((str.length / 2) + 2);

    var a = new ArrayBuffer(4);
    var c = new Uint16Array(a);
    var arr = new Uint8Array(a);
    c[1] = counter;
    c[0] = length;
    counter++;
    var mess = new Uint8Array((str.length / 2) + 4);

    for (var i = 0; i < 4; i ++)
    {
        mess[i] = arr[i];
    }

    for (var i = 0; i < str.length; i += 2)
    {
        mess[(i / 2) + 4] = parseInt(str.substr(i, 2), 16);
    }

    return mess;
}

function timeStamp()
{
    return (new Date).toISOString().replace(/z|t/gi,' ').trim();
}

function console_log(str)
{
    console.log(timeStamp() + ": "  + str);
}

function setLED11() {

    theArduinoBTDevice.send(packMessageForSending(1));
}
function setLED00() {

    theArduinoBTDevice.send(packMessageForSending(0));
}
function setLED1() {

    theArduinoBTDevice.send(1);
}
function setLED0() {

    theArduinoBTDevice.send(0);
}
function setLED1111() {

    theArduinoBTDevice.send(111111111);
}
function setLED0000() {

    theArduinoBTDevice.send(0000000000);
}
function tryToConnect()
{
    console_log("Trying to connect..." + theArduinoBTDevice.id);
    theArduinoBTDevice.open({ stopBits: 1, bitRate: 9600, ctsFlowControl: 0});
    ArudinoBTconnect = true;
    theArduinoBTDevice.set_receive_handler(function(data) {
        var inputData = new Uint8Array(data);
        console_log(data + "|" + inputData);
        
      });
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
       
       if ((dev.id == 'COM7')) {
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
            [" ", "set LED1",                                 "setLED0",                 "green"],
            [" ", "unset LED1",                               "setLED1",               "green"],
            [" ", "set LED2",                                 "setLED00",                 "green"],
            [" ", "unset LED2",                               "setLED11",               "green"],
            [" ", "set LED3",                                 "setLED0000",                 "green"],
            [" ", "unset LED3",                               "setLED1111",               "green"],
              ]
    };

    var serial_info = {type: 'serial'};
   ScratchExtensions.register('itamar12', descriptor, ext, {type: 'serial'});
})({});
