// Connector for the zvooq.ru service

function parseDurationString(timestr) {
    if (timestr) {
        var m = /(\d+):(\d+)/.exec(timestr);

        return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    }
    return 0;
}

function extractFirstValue(selector) {
    return $.makeArray($(selector)).map(function (a) {
        return $(a).text();
    })[0];
}

$(function() {
    var lastTrack = null;
    var $r = chrome.runtime.sendMessage;

    $(window).unload(function() {
		// reset the background scrobbler song data
		chrome.runtime.sendMessage({type: 'reset'});
		return true;      
    });

    $(".topPanelTimeline-title").bind('DOMSubtreeModified', function () {
        var songDuration = parseDurationString(extractFirstValue(".topPanelTimeline-length"));

        if (songDuration > 0) {
            var titleString = extractFirstValue(".topPanelTimeline-title>a");

            if (!titleString) {
                return;
            }

            var songInfo = /(.*)\s+—\s+(.*)/.exec(titleString);
            var artist = songInfo[1],
                 title = songInfo[2];
            
            if (lastTrack != titleString) {
                var total = songDuration;
                lastTrack = titleString;
                
                $r({type: 'validate', artist: artist, track: title}, function(response) {
                    if (response != false) {
                        $r({
                            type: 'nowPlaying', 
                            artist: response.artist, 
                            track: response.track, 
                            duration: total
                        });
                    } else {
                        $r({type: 'nowPlaying', duration: total});	
                    }
                });
            }
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

