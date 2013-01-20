var IMG_SRC  = 'media/tetris_block.jpg';
var OVERLAY  = 255;   // 0 = foreground, 255 = background

var tetrisImage;
var imageReady = false;
$(document).ready(function() {
    tetrisImage = new Image();
    tetrisImage.src = IMG_SRC;
    tetrisImage.onload = function() {
        imageReady = true;
    }
});

var total_pixels = 0;
var matching_pixels = 0;
var pass_percentage = 0.93;

/*
 * In this example, we show you how to overlay the shadow information over
 * an image painted into the canvas. This function is called in a loop
 * by shadowboxing.js. It overrides the default behavior of renderShadow(),
 * which draws the shadow in black on a white canvas.
 */
function renderShadow() {
    if (!background)    // if they haven't captured a background frame
        return;

    // shadow is an array of length 4*numPixels. Each pixel
    // is an [red green blue alpha] of the shadow information.
    // RGB gives you the color, while alpha indicates opacity.
    // Background pixels are white ([255 255 255 0]) and foreground
    // shadow pixels are black ([0 0 0 0]).
    shadow = getShadowData();

    // Drawing from our image onto the canvas
    if (imageReady) {
        // draw the image over the entire canvas
        shadowContext.drawImage(tetrisImage, 0, 0, shadowCanvas.width, shadowCanvas.height);    
        var pixels = shadowContext.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height);

        // Now that the shadowContext has our jpeg painted, we can
        // loop pixel by pixel and only show the parts where the shadow lies.
        // 
        // IMPORTANT: make sure that the width and height of your two
        // canvases match. Otherwise, here be dragons!
        for(var i = 0; i < shadow.data.length; i=i+4) {
		total_pixels++;
            	console.log("r:" + pixels.data[i] + " g:" + pixels.data[i+1] + " b:" + pixels.data[i+2]);
		if(pixels.data[i] < 245 && pixels.data[i+1] < 245 && pixels.data[i+2] < 245) {
		if (shadow.data[i] != OVERLAY && shadow.data[i+1] != OVERLAY && shadow.data[i+2] != OVERLAY) {
			matching_pixels++;
		}
	    } else {
		if (shadow.data[i] == OVERLAY && shadow.data[i+1] == OVERLAY && shadow.data[i+2] == OVERLAY) {
			matching_pixels++;
		} 
		}
	    // i = red; i+1 = green; i+2 = blue; i+3 = alpha
            if(shadow.data[i] == OVERLAY && shadow.data[i+1] == OVERLAY && shadow.data[i+2] == OVERLAY) {
                // If the current shadow pixel is to be overlayed, copy it over to
                // our canvas' pixel data
                pixels.data[i]   = shadow.data[i];
                pixels.data[i+1] = shadow.data[i+1];
                pixels.data[i+2] = shadow.data[i+2];
            }
        }
	console.log("yoo");
	console.log(matching_pixels/total_pixels);
	if ((matching_pixels/total_pixels) >= pass_percentage){
		console.log("done. On to next tetris block");
	}
        // And now, paint our pixels array back to the canvas.
        shadowContext.putImageData(pixels, 0, 0);
    }

    // Loop every millisecond. Changing the freq. is a tradeoff between
    // interactivity and performance. Tune to what your machine can support.
    setTimeout(renderShadow, 0);
}
