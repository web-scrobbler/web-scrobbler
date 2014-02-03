// Used only to remember last song title
var currentTrack = '';
var currentDuration = '';

// Glabal constant for the song container ....
var CONTAINER_SELECTOR = '.GEKKVSQBL-';
var TRACK_SELECTOR = '.GEKKVSQBN-';
var ARTIST_SELECTOR = '.GEKKVSQBAY';
var ALBUM_SELECTOR = '.GEKKVSQBF-';
var DURATION_SELECTOR = '#PlayerDuration';

$(function(){
	$(CONTAINER_SELECTOR).live('DOMSubtreeModified', function(e) {
		if (!newTrack()) {
			return;
		}
		updateNowPlaying();
		return;
	});

	$(DURATION_SELECTOR).live('DOMSubtreeModified', function(e) {
		if (!newTrack()) {
			return;
		}
		updateNowPlaying();
		return;
	});

	//setup unload handler
	$(window).unload(function() {
		chrome.runtime.sendMessage({type: 'reset'});
		return true;      
	});
});

/**
 * Called every time we load a new song
 */
function updateNowPlaying(){
    var parsedInfo = parseInfo();
    artist   = parsedInfo['artist']; 	//global
    track    = parsedInfo['track'];	//global
    album    = parsedInfo['album'];
    duration = parsedInfo['duration']; 	//global

    if (artist == '' || track == '' || duration == 0) {return;}

    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
      if (response != false) {
		console.log("Scrobbling track: artist: " + artist + ", track: " + track + ", album: " + album + ", duration: " + duration);
        chrome.extension.sendMessage({type: 'nowPlaying', artist: artist, track: track, album: album, duration: duration});
      }
      // on failure send nowPlaying 'unknown song'
      else {
        chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
      }
    });
}

function parseInfo() {
    var artist   = '';
    var track    = '';
    var album    = '';
    var duration = 0;

    // Get artist and song names
    var rawArtistValue = $(ARTIST_SELECTOR).children().first().attr("title");
    var rawTrackValue = $(TRACK_SELECTOR).children().first().attr("title");
    var rawAlbumValue = $(ALBUM_SELECTOR).children().first().attr("title");
    var rawDurationValue = $(DURATION_SELECTOR).text();

    try {
        if (null != rawArtistValue) {
            artist = rawArtistValue.trim();
        }
        if (null != rawTrackValue) {
            track = rawTrackValue.trim();
        }
        if (null != rawAlbumValue) {
            album = rawAlbumValue.trim();
        }
        if (null != rawDurationValue) {
            duration = parseDuration(rawDurationValue);
        }
    } catch(err) {
        return {artist: '', track: '', duration: 0};
    }

    return {artist: artist, track: track, album: album, duration: duration};
}

function parseDuration(artistTitle) {
	try {
		match = artistTitle.match(/\d+:\d+/g)[0]

		mins    = match.substring(0, match.indexOf(':'));
		seconds = match.substring(match.indexOf(':')+1);
		return parseInt(mins*60) + parseInt(seconds);
	} catch(err){
		return 0;
	}
}

function newTrack() {
    var rawTrackValue = $(TRACK_SELECTOR).children().first().attr("title");
    var rawDurationValue = $(DURATION_SELECTOR).text();
	if (currentTrack == rawTrackValue || currentDuration == rawDurationValue) {
		return false;
	}
	currentTrack = rawTrackValue;
	currentDuration = rawDurationValue
	return true;
}

/**
 * Simply request the scrobbler.js to submit song previusly specified by calling updateNowPlaying()
 */
/*function scrobbleTrack() {
   // stats
   chrome.runtime.sendMessage({type: 'trackStats', text: 'The Google Music song scrobbled'});

   // scrobble
   chrome.runtime.sendMessage({type: 'submit'});
}*/

/**
 * Listen for requests from scrobbler.js
 */
/*chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch(request.type) {
            // background calls this to see if the script is already injected
            case 'ping':
                sendResponse(true);
                break;
		}
	}
);*/