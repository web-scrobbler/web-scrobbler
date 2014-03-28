//Music Unlimited Connector
//Provides basic scrobbling, does NOT support pause or like
//Author: Rui Jiang
//Inspired by Google Music Connector

// Used only to remember last song title
var currentTrack = '';

// Glabal constant for the song information
var DURATION_SELECTOR = '#PlayerDuration';
var POSITION_SELECTOR = '#PlayerPosition';

// This is the most reliable way I've found for selecting the right thing
var CONTAINER_SELECTOR = '#ceneredSite div[style="position: absolute;"] div[style="position: relative; overflow: hidden;"]';

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
    console.log(parsedInfo);
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
    var rawArtistValue = getRawArtistValue();
    var rawTrackValue = getRawTrackValue();
    var rawAlbumValue = getRawAlbumValue();
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
    var rawTrackValue = getRawTrackValue();
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

function nowPlayingContainerElement() {
	// Start at the duration, which is one of the few elements around here to have an ID that Music Unlimited doesn't keep changing... I hope
	return document.querySelector(DURATION_SELECTOR).parentNode.parentNode
}

function trackTitlesContainer() {
	return nowPlayingContainerElement().children[0].children[0].children[0];
}

function getRawTrackValue() {
	return trackTitlesContainer().children[0].children[0].getAttribute("title");
}

function getRawArtistValue() {
	return trackTitlesContainer().children[2].children[0].getAttribute("title");
}

function getRawAlbumValue() {
	return trackTitlesContainer().children[1].children[0].getAttribute("title");
}
