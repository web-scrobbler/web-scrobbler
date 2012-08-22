var lastTrack = null;
var $r = chrome.extension.sendRequest;

function parseDurationString(timestr) {
    if (timestr) {
        var m = /(\d+):(\d+)/.exec(timestr);

        return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    }
    return 0;
}

function scrobble(e) {	
	var timestr	= '';
	if ($("#ac_duration").length > 0) {
	   timestr = $("#ac_duration").text();
	} else if ($("#pd_duration").length > 0) {
	   timestr = $("#pd_duration").text();
	}
	if (timestr != '') {
		if (timestr[0] == '-') {
            timestr = timestr.substring(1);
        }
        var duration = parseDurationString(timestr);
	}
	var artist = $("#gp_performer").text();
    var title = $("#gp_title").text();

    if (lastTrack != artist + " " + title) {
        var total = duration;

        lastTrack = artist + " " + title;

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

$(function() {
    $(window).unload(function() {
		// reset the background scrobbler song data
		chrome.extension.sendRequest({type: 'reset'});
		return true;      
    });

    $(document).bind("DOMNodeInserted", function(e) {
        if (e.target.id === "gp_performer") {
			$("#gp_performer").bind('DOMSubtreeModified', function(e) { setTimeout(scrobble, 500) });
		}
    });
});