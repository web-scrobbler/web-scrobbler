var track, artist, album, duration
var scrobbleTimeout = null;
$(function(){
	$("div#submit input").click(function(){
		//Listen for change in result div
		var c = 0;
		$('div#result').bind('DOMNodeInserted', function(e) {
			//HTML changed, NEW SONG!!!
			if (c == 0) {c++; return false;} //The jquery bind gets triggerd two times, is to avoid the code from being executed two times.
			
			//set vars
			artist = $("dd.artist").text()
			track = $("dd.track").text()
			album = $("dd.album").text()
			setTimeout(function(){
				var total_length = $("li#info_position").text().split(" / ")[1];
				duration = parseInt(total_length.split(":")[0]*60)+parseInt(total_length.split(":")[1])	// turn eg: 5:50 into seconds
			}, 1000);
			setTimeout('updateNowPlaying()', 1000);
			//small delay to allow duration to come up
			c=0	
		})		
	})
});

function updateNowPlaying() {
	if (artist == '' || track == '' || duration == 0) {return;}
	
	chrome.extension.sendRequest({type: 'validate', artist: artist, track: track}, function(response) {
		if (response == true){
			chrome.extension.sendRequest({type: 'nowPlaying', artist: artist, track: track, duration: duration});
			console.log({type: 'nowPlaying', artist: artist, track: track, duration: duration})
			
			var min_time = (240 < (duration/2)) ? 240 : (duration/2); //The minimum time is 240 seconds or half the track's total length. Duration comes from updateNowPlaying()
			// cancel any previous timeout
			if (scrobbleTimeout != null)clearTimeout(scrobbleTimeout);

			// set up a new timeout
			scrobbleTimeout = setTimeout(
				function(){
					// Turns status message into black when half of videos time has been played, to indicate that we are past the minimum time for a scrobble.
					//$("#chrome-scrobbler-status").addClass("scrobbled");
					//$("#chrome-scrobbler-status").attr("title","The minimum time for a scrobble has past");
					setTimeout(scrobbleTrack(), 2000);
				}, min_time*1000
			);
		}
	});
}

function scrobbleTrack() {
   // stats
   chrome.extension.sendRequest({type: 'trackStats', text: 'Ghostly track scrobbled'});
   
   // scrobble
   chrome.extension.sendRequest({type: 'submit'});
}
