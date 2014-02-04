var lastTrack = null;
var $r = chrome.runtime.sendMessage;

function scrobble(e) {
    var regexp = new RegExp("\\S+\\s(.+)\\s\\S\\s(.+)\\s\\S+", "gi");
    var current = $(".now-playing").text();
    var res = regexp.exec(current);
    var artist = res[1];
    var title = res[2];

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
    }
}

$(function() {
    $(window).unload(function() {
        // reset the background scrobbler song data
        chrome.runtime.sendMessage({type: 'reset'});
        return true;
    });

    if ($("#player").length > 0) {
        $(".pl-main-win").bind("DOMSubtreeModified", function(e) {
            if ($("#play").attr("class").indexOf("pause") != -1)
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