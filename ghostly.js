var track, artist, album, duration
var scrobbleTimeout = null;
var durationTimeout = null;
$(function(){
	$("div#submit input").click(function(){
		//Listen for change in result div
		var c = 0;
		$('div#result').bind('DOMNodeInserted', function(e) {
			//HTML changed, NEW SONG!!!			
			if (c == 0) {c++; return false;} //The jquery bind gets triggerd two times, is to avoid the code from being executed two times.
			// cancel any previous timeout
			if (scrobbleTimeout != null)clearTimeout(scrobbleTimeout);
			if (durationTimeout != null)clearTimeout(durationTimeout);
			displayMsg()
			//set vars
			artist = $("dd.artist").text()
			track = $("dd.track").text()
			album = $("dd.album").text()
			waitForDuration(updateNowPlaying)
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
			displayMsg("Scrobbling")
			
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





function waitForDuration(callback) {
	function getDuration() {
		var duration_el = $("li#info_position").text()
		if (duration_el == "loading..." || duration_el == "0:00")return false;
		var total_length = duration_el.split(" / ")[1];
		return parseInt(total_length.split(":")[0]*60)+parseInt(total_length.split(":")[1])	// turn eg: 5:50 into seconds
	}
	var check_1 = getDuration()
durationTimeout = setTimeout(function(){
		var check_2 = getDuration()
		if (check_1 == check_2 && check_1 != false && check_1 != 0 ){
			//not loading anymore
			duration = check_1
			console.log("check_1:"+check_1+" check_2:"+check_2)
			callback()
		}
		else {
			waitForDuration(callback)
		}
	}, 1000);
}

function displayMsg(msg) {
	$('#chrome-scrobbler-status').remove();  
	if (msg) {              
		$('#playButton').append('<span id="chrome-scrobbler-status" title="">'+msg+'</span>')
	}
}



