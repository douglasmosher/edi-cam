(function(window){ "use strict";

	// LED slider 
	var sliderChange = window.sliderChange = function(sliderValue) {
	    console.log("Slider changed: " + sliderValue);
	    wsServer.send(sliderValue);
	    // *** Task 14 ***
	  };

})(window);