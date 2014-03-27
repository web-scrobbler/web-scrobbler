//Music Unlimited Connector
//Provides basic scrobbling, does NOT support pause or like
//Author: Rui Jiang
//Inspired by Google Music Connector

// Used only to remember last song title
var currentTrack = '';

// Glabal constant for the song information
var CONTAINER_SELECTOR = '.GEKKVSQBO-';
var TRACK_SELECTOR = '.GEKKVSQBP-';
var ARTIST_SELECTOR = '.GEKKVSQBCY';
var ALBUM_SELECTOR = '.GEKKVSQBH-';
var DURATION_SELECTOR = '#PlayerDuration';
var POSITION_SELECTOR = '#PlayerPosition';

$(function(){
	//Whenever a new song starts playing, the container that holds media information should changes, thus triggering updateNowPlaying()
	$(CONTAINER_SELECTOR).live('DOMSubtreeModified', function(e) {
		if (!newTrack()) {
			return;
		}
		updateNowPlaying();
		return;
	});

	//This is the only way that I could think of to allow scrobbling the first song being played after the application launches, by monitoring the player duration
	//If anyone comes up with a better way around it, please feel free to improve it
	$(DURATION_SELECTOR).live('DOMSubtreeModified', function(e) {
		if (!newTrack()) {
			return;
		}
		updateNowPlaying();
		return;
	});

	//Setup unload handler
	$(window).unload(function() {
		chrome.runtime.sendMessage({type: 'reset'});
		return true;      
	});
});


//Called every time we load a new song
function updateNowPlaying(){
    var parsedInfo = parseInfo();
    artist   = parsedInfo['artist'];
    track    = parsedInfo['track'];
    album    = parsedInfo['album'];
    duration = parsedInfo['duration'];

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
    var artist, track, album, duration;

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

//Converts duration from string form to seconds
function parseDuration(artistTitle) {
	try {
		match = artistTitle.match(/\d+:\d+/g)[0];
		mins = match.substring(0, match.indexOf(':'));
		seconds = match.substring(match.indexOf(':')+1);
		return parseInt(mins*60) + parseInt(seconds);
	} catch(err){
		return 0;
	}
}

//Detects if a new song is indeed being played
function newTrack() {
    var rawTrackValue = $(TRACK_SELECTOR).children().first().attr("title");
    var rawDurationValue = $(DURATION_SELECTOR).text();
	if (currentTrack == rawTrackValue || '' == rawDurationValue || '0:00' == rawDurationValue) {
		return false;
	}
	var rawPositionValue = $(POSITION_SELECTOR).text();
	//Due to weird behavior of the application where currentTrack gets erased every time you click something on the page
	if ('' == currentTrack && '0:00' != rawPositionValue) {
		currentTrack = rawTrackValue;
		return false;
	}
	currentTrack = rawTrackValue;
	return true;
}
