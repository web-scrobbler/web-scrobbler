var lastTrack = '';
var startTime = 0;

function parseDuration (duration) {
    var res = /(\d+):(\d+)/.exec(duration);
    return parseInt(res[1], 10) * 60 + parseInt(res[2], 10);
}

function scrobble () {
    var artist = $('span.m_c_artist').text();
    var title = $('span.m_track_source').text();
    var duration = parseDuration($('span.m_h_player_seek_time_duration').text().substring(1));

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
            $('.m_h_player.m_h_i').bind('DOMSubtreeModified', function () {
                    if (($('.__play').length == 0) && ($('.__pause').length > 0))
                        setTimeout(scrobble, 1000);
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