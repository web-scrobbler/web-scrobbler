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
    if ($("#pd_duration").length > 0) {
        var timestr = $("#pd_duration").text();
        if (timestr[0] == '-') {
            timestr = timestr.substring(1);
        }
        var duration = parseDurationString(timestr);
    
        if (duration > 0) {
            var artist = $("#pd_performer").text();
            var title = $("#pd_title").text();
        }
    } else if($("#initial_list").length > 0) {
        var current = $("#initial_list .current");
        var timestr = $(".duration", current).text();
        if (timestr[0] == '-') {
            timestr = timestr.substring(1);
        }
        var duration = parseDurationString(timestr);
    
        if (duration > 0) {
            var artist = $(".title_wrap > b > a", current).text();
            var title = $(".title > a", current).text();
        }
    } else {
        return;
    }

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
        if (e.target.id === "pd_duration") {
            $("#pd_duration").bind('DOMSubtreeModified', scrobble);
        }
    });
});
