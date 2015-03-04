var video = document.querySelector('video'),
		canvas = document.querySelectorAll('canvas'),
		bgCanvas = document.createElement('canvas'),
		bgContext = bgCanvas.getContext('2d'), // Create a background canvas
	 	w, h, ratio; // Define some vars required later

// Add a listener to wait for the 'loadedmetadata' or 'canplaythrough' state so the video's dimensions can be read
video.addEventListener('loadedmetadata', function() { init(); }, true);
video.addEventListener('canplaythrough', function() { init(); }, true);

// Calculate ratio and dimensions
function init() {
for(var i=0, j=canvas.length; i<j; i+=1){
		// Calculate the ratio of the video's width to height
		ratio = video.videoWidth / video.videoHeight;
		// Define the required width as 100 pixels smaller than the actual video's width
		w = video.videoWidth - 100;
		// Calculate the height based on the video's width and the ratio
		h = parseInt(w / ratio, 10);
		// Set the canvas width and height to the values just calculated
		canvas[i].width = w;
		canvas[i].height = h;
		bgCanvas.width = w;
		bgCanvas.height = h;
	}
}

// When the video starts or resumes to play, set the makeItGrey() function to be called every 33 milliseconds
video.addEventListener('play', function() {
	setInterval("makeItGrey()", 33);
}, false);
// Stop the makeItGrey() function being called when the video is either paused or ended
video.addEventListener('paused', function() {
	clearInterval();
}, false);
video.addEventListener('ended', function() {
	clearInterval();
}, false);

// Make the video grey, and copy it
function makeItGrey() {
	// Grab the pixel data and work on that directly
	var context = [],
			pixelData = [],
			fliterColor = [];

	// Draw the video onto the backing canvas
	bgContext.drawImage(video, 0, 0, w, h);

	for(var i = 0, j = 8; i < j; i+=1){
		pixelData[i] = bgContext.getImageData(0, 0, w, h);
	}

	// Loop through each pixel and convert it to grey scale
	for(var k = 0, f = pixelData.length; k < f; k+=1){
		for (var i = 0, d = pixelData[k].data.length; i < d; i+=4) {
			// Get the RGB values for this pixel
			var r = pixelData[k].data[i],
					g = pixelData[k].data[i+1],
					b = pixelData[k].data[i+2];

			// Get the fliter colour across all 3 RGB values
			fliterColor.red = (r + g + b) / (k+2);
			fliterColor.green = (r + g + b) / (k+1);
			fliterColor.blue = (r + g + b) / (k);

			pixelData[k].data[i] = fliterColor.red;
			pixelData[k].data[i+1] = fliterColor.green;
			pixelData[k].data[i+2] = fliterColor.blue;
		}
	}
	// Get a handle on the 2d context of the canvas element
	// Draw the data on the visible canvas
	for(var i = 0, j = canvas.length; i < j; i+=1){
		context[i] = canvas[i].getContext('2d');
		context[i].putImageData(pixelData[i], 0, 0);
	}
	// Draw the data on the visible canvas
}