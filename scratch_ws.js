/**
 * Created by asharafk on 10/9/17.
 */
(function(ext) {
	
    var debugLevel = 0;

    //var device = null;
    var socket = null;

    var connected = false;
	
    var myStatus = 1; // initially yellow
    var myMsg = 'not_ready';
	
	
	ext.connectwb = function () {
        //if(debugLevel)
        console.log('Connecting to Server');
        window.socket = new WebSocket("ws://localhost:5001");
        window.socket.onopen = function () {
            var msg = JSON.stringify({
               // "command": "ready"
            });
            window.socket.send(msg);
            //if(debugLevel)
                console.log("Connected!");
            myStatus = 2;
            myMsg = 'ready';
            connected = true;
        };
		
	window.socket.onmessage = function (message) {
	};
		 
	//noinspection JSUnusedLocalSymbols
        window.socket.onclose = function (e) {
            console.log("Connection closed.");
            socket = null;
            connected = false;
            myStatus = 1;
            myMsg = 'not_ready'
        };
	}
	
	ext.sendMsg = function (msg) {
        if (connected == false) {
            alert("Server Not Connected");
        }
        else {
            var msg = JSON.stringify({
                //"command": 'sending msg', 'Message': msg
		    msg
            });
           // if (debugLevel)
                console.log(msg);
            window.socket.send(msg);
        }
    };
	ext.move_on_time = function (steering, time, power) {
        if (connected == false) {
            alert("Server Not Connected");
        }
        else {
            var msg = JSON.stringify({
                //"command": 'sending msg', 'Message': msg
		    steering time power
            });
           // if (debugLevel)
                console.log(msg);
            window.socket.send(msg);
        }
    };	
		
	
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {
		 var msg = JSON.stringify({
            "command": "shutdown"
        });
        window.socket.send(msg);
	};
	
    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: myStatus, msg: myMsg};
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
		 // Block type, block name, function name
            [' ', 'Connect to websocket', 'connectwb'],
            [' ', 'MOVE_ON_TIME steering %n time %n power %n', 'move_on_time' , '0', '10', '50'],

        ],
    };

    // Register the extension
    ScratchExtensions.register('Sample extension', descriptor, ext);
})({});
