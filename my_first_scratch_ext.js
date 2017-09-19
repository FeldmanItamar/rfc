var DEBUG_NO_EV3 = false;
var theEV3Device = theEV3Device || null;
var EV3ScratchAlreadyLoaded = EV3ScratchAlreadyLoaded || false;
var EV3Connected = EV3Connected || false;
var potentialEV3Devices = potentialEV3Devices || [];
var waitingForInitialConnection = waitingForInitialConnection || false;
var potentialDevices = potentialDevices || []; // copy of the list
var connecting = connecting || false;
var connectionTimeout = connectionTimeout || null;

function connectingOrConnected()
{
    return (EV3Connected || connecting);
}

function weConnected()
{
    waitingForInitialConnection = false;

    EV3Connected = true;
    connecting = false;
}

function notConnected()
{
    return (!theEV3Device || !EV3Connected);
}

function disconnected()
{
    EV3Connected = false;

    //    alert("The connection to the brick was lost. Check your brick and refresh the page to reconnect. (Don't forget to save your project first!)");
    /* if (r == true) {
     reconnect();
     } else {
     // do nothing
     }
     */
}

function(ext)
{
     ext.reconnectToDevice = function()
     {
        tryAllDevices();
     }

     ext._getStatus = function()
     {
         if (!EV3Connected)
            return { status:1, msg:'Disconnected' };
         else
            return { status:2, msg:'Connected' };
     };

     ext._deviceRemoved = function(dev)
     {
         console_log('Device removed');
         // Not currently implemented with serial devices
     };

     ext._deviceConnected = function(dev)
     {
         console_log('_deviceConnected: ' + dev.id);
         if (EV3Connected)
         {
            console_log("Already EV3Connected. Ignoring");
         }
         // brick's serial port must be named like tty.serialBrick7-SerialPort
         // this is how 10.10 is naming it automatically, the brick name being serialBrick7
         // the Scratch plugin is only letting us know about serial ports with names that
         // "begin with tty.usbmodem, tty.serial, or tty.usbserial" - according to khanning

         if ((dev.id.indexOf('/dev/tty.serial') === 0 && dev.id.indexOf('-SerialPort') != -1) || dev.id.indexOf('COM') === 0)
         {

             if (potentialEV3Devices.filter(function(e) { return e.id == dev.id; }).length == 0)
             {
                potentialEV3Devices.push(dev);
             }

             if (!deviceTimeout)
                deviceTimeout = setTimeout(tryAllDevices, 1000);
         }
     };


     ext._shutdown = function()
     {
         console_log('SHUTDOWN: ' + ((theEV3Device) ? theEV3Device.id : "null"));
        /*
         if (theEV3Device)
         theEV3Device.close();
         if (poller)
         clearInterval(poller);
         EV3Connected = false;
         theEV3Device = null;
         */
     };

     ext.setLED = function(pattern, callback)
     {
        setLED(pattern, callback);
     }

     // Block and block menu descriptions
     var descriptor = {
     blocks: [
         [' ', 'my first block3', 'my_first_block'],
              [" ", "set LED %m.patterns",                                 "setLED",                 "green"],
            
                    ],
     "menus": {

     "patterns": ["off", "green", "red", "orange", "green flashing", "red flashing", "orange flashing", "green pulse", "red pulse", "orange pulse"],
     },
     };

 //    ['w', 'wait until light sensor %m.whichInputPort detects black line',   'waitUntilDarkLinePort',   '1'],
 //    ['R', 'battery level',   'readBatteryLevel'],
 //  [' ', 'reconnect', 'reconnectToDevice'],

     var serial_info = {type: 'serial'};
     ScratchExtensions.register('EV3 Control', descriptor, ext, serial_info);
     console_log(' registered extension. theEV3Device:' + theEV3Device);

     console_log("EV3ScratchAlreadyLoaded: " + EV3ScratchAlreadyLoaded);
     EV3ScratchAlreadyLoaded = true;
})({});
