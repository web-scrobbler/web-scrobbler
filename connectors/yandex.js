var lastTrack = '';
var startTime = 0;

function parseDuration (duration) {
    var res = /(\d+):(\d+)/.exec(duration);
    // note: not found how songs which longer than 1 hour are displayed
    return parseInt(res[1], 10) * 60 + parseInt(res[2], 10);
}

function scrobble () {
    var artist = $(".js-player-artist").text();
    var title = $(".js-player-title").text();
    var duration = parseDuration($(".b-jambox__ftime").text());

    var now = new Date().getTime();
    var isNewPlaying = (lastTrack != artist + ' ' + title) || /* new artist-title pair or */
            ((lastTrack == artist + ' ' + title) && ((now - startTime) > 1000 * duration)); /* repeated playing of same track */
    
    if (isNewPlaying) {
        lastTrack = artist + ' ' + title;
        startTime = now;

        chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title}, function (response) {
            if (response !== false) {
                chrome.runtime.sendMessage({
                    type: 'nowPlaying',
                    artist: response.artist,
                    track: response.track,
                    duration: duration
                });
            } else
                chrome.runtime.sendMessage({type: 'nowPlaying'}); // unidentified music
        });
    }
}

$(function () {
    $(window).unload(function () {
	// reset the background scrobbler song data
	chrome.runtime.sendMessage({type: 'reset'});
	return true;
    });

    $(".b-jambox__controls").bind("DOMSubtreeModified", function () {
        if ($(".b-jambox__button.b-jambox__play.b-jambox__playing").length > 0)
            setTimeout(scrobble, 1000);
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