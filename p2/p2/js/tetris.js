var c1, c2, c3, ID = null;
var time = null;

function startTimer() {
    if (ID != null) {
        stopTimer();
    }
    c1 = 0;
    c2 = 0;
    c3 = 0;
    ID = window.setInterval(run, 1000);
}

function stopTimer() {
    window.clearInterval(ID);
    ID = null;
}

function run() {
    c1++;
    if (c1 == 60) {
        c1 = 0;
        c2++;
        if (c2 == 60) {
            c2 = 0;
        }
    }

    var o1 = (c1 <= 9 ? "0" : "") + c1;
    var o2 = (c2 <= 9 ? "0" : "") + c2;
    var o3 = (c3 <= 9 ? "0" : "") + c3;
    document.getElementById("time").innerHTML = o3 + ":" + o2 + ":" + o1;
}


var IMG_SRC  = 'media/testris2.jpg';
var OVERLAY  = 255;   // 0 = foreground, 255 = background
var imageArr = new Array ('media/tetris10.jpg', 'media/tetris9.jpg', 'media/tetris11.jpg', 'media/tetris5.jpg', 'media/tetris6.jpg', 'media/tetris7.jpg');
var index = 0;

var tetrisImage;
var imageReady = false;
$(document).ready(function() {
    tetrisImage = new Image();
    tetrisImage.src = imageArr[index];
    tetrisImage.onload = function() {
        imageReady = true;
    }
});

var total_pixels = 0;
var matching_pixels = 0;
var pass_percentage = 0.90;

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
	matching_pixels = 0;
	total_pixels = 0;
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

            //if image pixel is red, then check if corresponding pixel of shadow is white
    		if(pixels.data[i] > 245 &&  pixels.data[i+1] < 10 && pixels.data[i+2] < 10) {
                if (shadow.data[i] == OVERLAY && shadow.data[i+1] == OVERLAY && shadow.data[i+2] == OVERLAY) {
                    matching_pixels++;
                } 
    	    } else {//else check if corresponding pixel of shadow is not white

                if (shadow.data[i] != OVERLAY && shadow.data[i+1] != OVERLAY && shadow.data[i+2] != OVERLAY) {
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
    var scoreDisplay = document.getElementById("score-display");
    var score = Math.round(100*matching_pixels/total_pixels);
    scoreDisplay.innerHTML = " " + score + "%";
	if ((matching_pixels/total_pixels) >= pass_percentage){
    	if (index < (imageArr.length - 1)){
            //$('#basic-modal-content').modal();
             alert("Congratulations! You passed the level! On to next image...");
             alert("Please move yourself out of image before moving to next image.")
			index++;
			tetrisImage = new Image();
    		tetrisImage.src = imageArr[index];

		}else{
            alert("Congratulations, you finished all levels!")
            stopTimer();
            alert("You finished in " + document.getElementById("time").innerHTML)
            location.reload();
        }
	}
        // And now, paint our pixels array back to the canvas.
        shadowContext.putImageData(pixels, 0, 0);
    }

    // Loop every millisecond. Changing the freq. is a tradeoff between
    // interactivity and performance. Tune to what your machine can support.
    setTimeout(renderShadow, 0);
}



