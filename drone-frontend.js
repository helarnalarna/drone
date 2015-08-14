var tracker;

function init() {
    var tracker = initTracker("#droneview");
    tracking.track("tracker, #droneview .drone");
}

function initTracker(element) {
    // Initialise a color tracker
    var tracker = new tracking.ColorTracker();

    // We only want rectangles that have each dimension no smaller than 20 pixels
    // tracker.setMinDimension(20);

    // The colors we're interested in
    TrackerUtils.addTrackingColor("#A94A45", "red", tracker);
    TrackerUtils.addTrackingColor("#5EA24E", "green", tracker);
    TrackerUtils.addTrackingColor("#CB7F84", "magenta", tracker);
    TrackerUtils.startTrackingColors(tracker);

    // Whenever there is a new color detected, mark them
    tracker.on('track', function(event) {
        markColors(event.data, element);
        decideDroneMovement(event.data);
    });

    return tracker;
}


function markColors(colors, element) {
    // Remove previously drawn rectangles indicating detected colors
    // Get the drawing surface
    var canvas = $(element + ' .canvas').get(0);
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    $(element + " .output").empty();
    for (var i = 0; i < colors.length; i++) {
        drawRectangle(colors[i], context);
        writeRectangle(colors[i], element + " .output");
    }
}

// Draw an overlay marking the detected color rectangle
function drawRectangle(rect, context) {
    context.strokeStyle = rect.color;
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    context.font = '11px Helvetica';
    context.fillStyle = "#fff";
    context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
    context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
}

// Write the information out in text
function writeRectangle(rect, element) {
    $(element)
        .append("<p class = 'text'>" + rect.color + ": " + rect.width + "X" + rect.height + " @ " + rect.x + ":" + rect.y + "</p>")
}

function decideDroneMovement(colors) {
    var move = {
        left: false,
        right:false
    };

    colors.forEach(function(rectangle) {
        if (rectangle.color === "green") {
            if(rectangle.width > 250) {
                move.left = true;
            }
        }

        else if (rectangle.color === "red") {
            if (rectangle.width > 250) {
                move.right = true;
            }
        }
    });

console.log("Move", move);
droneConnection.send(move);
}


window.addEventListener("load", init);