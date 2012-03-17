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
    var timestr = $("#gp_duration").text();
    if (timestr[0] == '-') {
        timestr = timestr.substring(1);
    }
    var duration = parseDurationString(timestr);

    if (duration > 0) {
        var artist = $(".title_wrap > .fl_l > b").text();
        var title = $(".title_wrap > .fl_l").text().split(" - ").pop();

        if (lastTrack != $(".title_wrap > .fl_l").text()) {
            var total = duration;

            lastTrack = $(".title_wrap > .fl_l").text();

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
} 

$(function() {
    $(window).unload(function() {
		// reset the background scrobbler song data
		chrome.extension.sendRequest({type: 'reset'});
		return true;      
    });

    $(document).bind("DOMNodeInserted", function(e) {
        if (e.target.id === "gp_duration") {
            $("#gp_duration").bind('DOMSubtreeModified', scrobble);
        }
    });
});
