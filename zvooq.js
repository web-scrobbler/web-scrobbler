function parseDurationString(timestr) {
    if (timestr) {
        var m = /(\d+):(\d+)/.exec(timestr);

        return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    }
    return 0;
}

$(function() {
    var lastTrack = null;
    var $r = chrome.extension.sendRequest;

    $(window).unload(function() {
		// reset the background scrobbler song data
		chrome.extension.sendRequest({type: 'reset'});
		return true;      
    });

    $(".topPanel_playerPlayback_leave").bind('DOMSubtreeModified', function (e) {
        var duration = parseDurationString($(".topPanel_playerPlayback_leave").text());

        if (duration > 0) {
            var m = /(.*)\s+—\s+(.*)/.exec($(".topPanel_playerPlayback_playered_name").text());
            var artist = m[1];
            var title = m[2];
            
            if (lastTrack != $(".topPanel_playerPlayback_playered_name").text()) {
                var total = duration;

                lastTrack = $(".topPanel_playerPlayback_playered_name").text();
                
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
