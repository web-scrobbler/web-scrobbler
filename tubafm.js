/*
 * Chrome-Last.fm-Scrobbler tuba.fm connector
 * 2012 Michal Rumanek <michal.rumanek@gmail.com>
 * 
 * (based on Zvooq.ru connector)
 */

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
		chrome.extension.sendRequest({type: 'reset'});
		
		return true;      
    }); 

    $("#app_song_title\\[0\\]").bind('DOMSubtreeModified', function (e) {
		$("#app_time").bind('DOMSubtreeModified', function (e) {
			var duration = parseDurationString($(this).text());
			if (duration > 0) {
				$(this).unbind('DOMSubtreeModified');
				
				var artist = $("#app_artist_name\\[0\\]").text();
				var title = $("#app_song_title\\[0\\]").text();
				if (lastTrack != (artist + " - " + title)) {
					var total = duration;

					lastTrack = artist + " - " + title;
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
});
