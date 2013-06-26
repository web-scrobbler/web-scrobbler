function parseDurationString(timestr) {
    if (timestr) {
        var m = /(\d\d):(\d\d)/.exec(timestr);

        return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    }
    return 0;
}

$(function() {
    var lastTrack = null;

    $(window).unload(function() {
		// reset the background scrobbler song data
		chrome.extension.sendRequest({type: 'reset'});
		return true;      
    });

    $(".time").bind('DOMSubtreeModified', function (e) {
        var current = parseDurationString($(".time").text());
        
        if (current > 0) {
            var m = /(.*)\s+-\s+(.*)\s+\((\d\d:\d\d)\)/.exec($(".track_name").text());
            var artist = m[1];
            var title = m[2];
            var total = parseDurationString(m[3]); 
            var track = artist + "-" + title;
            var $r = chrome.extension.sendRequest;
            
            if (track != lastTrack) {
                lastTrack = track;

                
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
