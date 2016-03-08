(function(window){ "use strict";

	var wsUrl = 'ws://192.168.0.22:8084/';
	var ws = new WebSocket(wsUrl);
	// LED slider 
	var sliderChange = window.sliderChange = function(sliderValue) {
	    console.log("Slider changed: " + sliderValue);
	    ws.send(sliderValue);
	    // *** Task 14 ***
	  };

})(window);