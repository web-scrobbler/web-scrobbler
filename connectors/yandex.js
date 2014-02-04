var lastTrack = null;
var $r = chrome.runtime.sendMessage;
var startScrobbling = false;

function scrobble(e) {
    if (startScrobbling) return; // prevent multiple execution
    startScrobbling = true;
    var artist = $(".js-player-artist").text();
    var title = $(".js-player-title").text();

    if (lastTrack != artist + " " + title) {
        lastTrack = artist + " " + title;

        $r({type: 'validate', artist: artist, track: title}, function(response) {
            if (response != false) {
                $r({
                    type: 'nowPlaying',
                    artist: response.artist,
                    track: response.track,
                    duration: Math.floor(response.duration / 1000)
                });
            } else {
                $r({type: 'nowPlaying'});
            }
        });
        
        startScrobbling = false;
    }
}

$(function() {
    $(window).unload(function() {
        // reset the background scrobbler song data
        chrome.runtime.sendMessage({type: 'reset'});
        return true;
    });

    if ($(".b-jambox__controls").length > 0) {
        $(".b-jambox__controls").bind("DOMSubtreeModified", function(e) {
            if ($(".b-jambox__button.b-jambox__play.b-jambox__playing").length > 0)
                setTimeout(scrobble, 500);
        });
    }
});


/**
 * Listen for requests from scrobbler.js
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.type) {

            // background calls this to see if the script is already injected
            case 'ping':
                sendResponse(true);
                break;
        }
    }
);