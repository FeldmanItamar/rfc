var EV3Connected = EV3Connected || false;


(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function()  {
         if (!EV3Connected)
            return { status:1, msg:'Disconnected' };
         else
            return { status:2, msg:'Connected' };
     };

    ext.setLED = function()
     {
        setLED();
     }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [" ", "set LED",                                 "setLED",                 "green"],
        ]
    };

    // Register the extension
    ScratchExtensions.register('My first extension', descriptor, ext);
})({});
