var lastTrack = '';
var lastTrackDuration = Number.MAX_VALUE;
var lastPlaying = 0;

var startTime = 0;
var currentTime = 1;
var lastControlPoint = new Date().getTime();
var controlPoint = new Date().getTime();

var updateChecker;

function scrobble () {
    // calculating elapsed song time by a more logical way
    // put this block into beginning just to lessen mean bias
    controlPoint = new Date().getTime();
    if (lastPlaying) {
        currentTime += (controlPoint - lastControlPoint);
    }
    lastControlPoint = controlPoint;

    if (!$('#gp_play').hasClass('playing')) {
        if (lastPlaying) {
            chrome.runtime.sendMessage({type: 'nowPlaying'});
        }
        lastPlaying = 0;
        return;
    }

    var artist = $('#gp_performer').text();
    var title = $('#gp_title').text();
    
    var checkByTime = currentTime > lastTrackDuration;
    
    // console.log(lastTrackDuration + ' ' + startTime + ' ' + checkByTime);

    if ((lastTrack != artist + ' ' + title) || checkByTime) {
        lastTrack = artist + ' ' + title;
        currentTime = 1;
    }

    if ((lastTrack != artist + ' ' + title) || checkByTime || !lastPlaying) {
        chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title}, function (response) {
            if (response !== false) {
            	lastTrackDuration = response.duration;
            	chrome.runtime.sendMessage({
                    type: 'nowPlaying',
                    artist: response.artist,
                    track: response.track,
                    currentTime: Math.floor(currentTime / 1000),
                    duration: Math.floor(response.duration / 1000)
                });
            } else {
            	lastTrackDuration = Number.MAX_VALUE; // avoid checkByTime to be true 
                chrome.runtime.sendMessage({type: 'nowPlaying'});
            }
        });
    }
    lastPlaying = 1;
}

$(function () {
    $(window).unload(function () {
	// reset the background scrobbler song data
	chrome.runtime.sendMessage({type: 'reset'});
	clearInterval(updateChecker);
	return true;
    });

    $(document).bind("DOMNodeInserted.scrobbler", function (e) {
        if (e.target.id === "gp") { // player found
		$(document).unbind("DOMNodeInserted.scrobbler"); // only once
			// console.log("player found");
			setTimeout(function () {
				updateChecker = setInterval(scrobble, 1000);
				// start processing player updates
			}, 1000);
		}
    });
});


/**
 * Listen for requests from scrobbler.js
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch(request.type) {

            // background calls this to see if the script is already injected
            case 'ping':
                sendResponse(true);
                break;
        }
    }
);

