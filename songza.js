/*
 * Chrome Chrome-Last.fm-Scrobbler Songza.com Connector by Michael Mazzola
 * based on George Pollard's bandcamp connector
 * v0.1
 */

var lastTrack = null;

var artistPart = ".szi-info .szi-artist";
var trackPart = ".szi-info .szi-title";
var durationPart = ".szi-progress .szi-bar";
var songPlayer = ".sz-player-revamp";
var pauseState = "sz-player-state-pause";
var pauseButton = ".szi-control";
var defaultDuration = 120;

$(function(){
	// reset the background scrobbler song data
	reset();
});

// Detect if the song has changed
$(songPlayer).live('DOMSubtreeModified',function(e){
	updateCurrentlyPlaying();
});

// Detect if the user has paused the song
$(pauseButton).click( function(e){
	playOrPauseMusic();
});

function updateCurrentlyPlaying() {
	var artist = $(artistPart).first().text();
	var track = $(trackPart).first().text();
	var duration = parseDuration();

	if (duration.current > 0) {
		if (lastTrack != track) {
			lastTrack = track;

			//console.log("SongzaScrobbler: scrobbling '" + track + "' by " + artist);
			chrome.extension.sendRequest({type: 'validate', artist: artist, track: track}, function(response) {
				if (response) {
					chrome.extension.sendRequest({type: 'nowPlaying', artist: response.artist, track: response.track, duration: duration.total});
				} else {
					chrome.extension.sendRequest({type: 'nowPlaying', duration: duration.total});	
				}
			});
		}
	}
}

function playOrPauseMusic() {
	if ($(songPlayer).hasClass(pauseState)) {
		chrome.extension.sendRequest({type: 'reset'});
	} else {
		updateCurrentlyPlaying();
	}
}

// bind page unload function to discard current "now listening"
function reset() {
	$(window).unload(function() {      
		chrome.extension.sendRequest({type: 'reset'});
		return true;      
	});
}

function parseDuration() {
	// Songza does not display the total duration of a song so we use a default duration
	return {total: defaultDuration, current:$(durationPart).width()};
}