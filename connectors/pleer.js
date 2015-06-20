var lastTrack = '';
var startTime = 0;

function parseDuration (duration) {
    var res = /(\d+):(\d+)/.exec(duration);
    return parseInt(res[1], 10) * 60 + parseInt(res[2], 10);
}

function isLastTrack(artist, title) {
    return lastTrack == artist + ' ' + title;
}

function scrobble () {
    var res = /\S+\s(.+)\s\S\s(.+)\s\(([^)]+)\)/gi.exec($('.now-playing').text());
    var artist = res[1];
    var title = res[2];
    var duration = parseDuration(res[3]);
    /* When pleer.com is unable to play song, it sets duration of song to zero.
     * Detect this case and cancel scrobbling.
     */
    if (duration == 0) {
        chrome.runtime.sendMessage({type: 'reset'});
        return;
    }

    var now = new Date().getTime();
    var isNewPlaying = (!isLastTrack(artist, title)) || /* new artist-title pair or */
            ((isLastTrack(artist, title)) && ((now - startTime) > 1000 * duration)); /* repeated playing of same track */
    
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

    $('.pl-main-win').bind('DOMSubtreeModified', function () {
        if ($('#play').attr('class').indexOf('pause') != -1) 
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
