var lastTrack = '';
var startTime = 0;

function parseDuration (duration) {
    var res = /(\d+):(\d+)/.exec(duration);
    return parseInt(res[1], 10) * 60 + parseInt(res[2], 10);
}

function scrobble () {
    var artist = $('span.mus_player_artist').text();
    var title = $('span.mus_player_song').text();
    var duration = parseDuration($('span.mus_player_duration').text().substring(1));

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

    $(document).bind('DOMSubtreeModified.waitplayer', function (e) {
        if (e.target.id == 'm_mc') {
            $(document).unbind('DOMSubtreeModified.waitplayer');
            $('.mus_player.mus_header_i').bind('DOMSubtreeModified', function() {
                if (($('.mus_player-controls.mus_header_i .__play').length == 0) && ($('.mus_player-controls.mus_header_i .__pause').length > 0)) {
                    setTimeout(scrobble, 1000);
                }
            });
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