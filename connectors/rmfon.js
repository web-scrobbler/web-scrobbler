// By Ostah, based on sullen-ural.js - code is awful but it is working 

$(function()
{
    var last = null,
        $r = chrome.runtime.sendMessage;

    $(window).unload(function()
    {
        $r({type: 'reset'});
        return true;
    });

    $( "#now-info" ).bind('DOMSubtreeModified', function()
    {
        var current = $( "#now-title" ).text();
        if (current !== last)
        {
            last = current;
			
			var duration = 3*60;
			var current_time = parseInt($(".playlist-line.playlist-current").find(".time").text().split(':')[1]);
			var next_time = parseInt($(".playlist-line.playlist-current").next().find(".time").text().split(':')[1]);
			
			if(current_time < next_time){
				duration = (next_time - current_time)*60;
			}
			else{
			// 58 02 - > 4
				duration = (next_time + (current_time-60))*60;
			}
			
            $r({type: 'validate', artist: $( "#now-artist" ).text(), track: $( "#now-title" ).text(), duration: duration}, function(response) {
                if (response)
                    $r({type: 'nowPlaying', duration: duration, artist: response.artist, track: response.track});
                else
                    $r({type: 'nowPlaying', duration: duration});
            });
        }
    });
});
