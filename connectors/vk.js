var lastTrack = '';
var lastTrackDuration = Number.MAX_VALUE;
var startTime = 0;
var updateChecker;

function scrobble () {
    if (!$('#gp_play').hasClass('playing')) return;
	
    var artist = $('#gp_performer').text();
    var title = $('#gp_title').text();
    
    var checkByTime = (new Date().getTime() - startTime) > lastTrackDuration; // for repeated listening
    
    // console.log(lastTrackDuration + ' ' + startTime + ' ' + checkByTime);

    if ((lastTrack != artist + ' ' + title) || checkByTime) {
        lastTrack = artist + ' ' + title;
        startTime = new Date().getTime();

        chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title}, function (response) {
            if (response !== false) {
            	lastTrackDuration = response.duration;
            	chrome.runtime.sendMessage({
                    type: 'nowPlaying',
                    artist: response.artist,
                    track: response.track,
                    duration: Math.floor(response.duration / 1000)
                });
            } else {
            	lastTrackDuration = Number.MAX_VALUE; // avoid checkByTime to be true 
        	chrome.runtime.sendMessage({type: 'nowPlaying'});
            }
        });
    }
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

