/*jslint sloppy: true */
/*global LFM_WATCHED_CONTAINER:true, $ */
/*member length, text, split, log, chrome, runtime, sendMessage, live, unload,
artist, track, duration, album, type, hasClass */
/*
 * Chrome-Last.fm-Scrobbler Slacker.com Connector
 * 
 * Uses Jordan Perr's pandora connector as a template --- http://jperr.com --- jordan[at]jperr[dot]com
 *
 * Joe Crawford joe@artlung.com
 */

/********* Configuration: ***********/

// changes to the DOM in this container will trigger an update.
var SITE_VERSION;
var SITE_VERSION_4 = 4;
var SITE_VERSION_6 = 6;

function LFM_WATCHED_CONTAINER() {
 return (SITE_VERSION === SITE_VERSION_6) ? 'section.mini' : 'div#track-metadata';
}

function LFM_IS_A_SONG() {
	if (SITE_VERSION === SITE_VERSION_6) {
		return ($('ul[id=tuning]:visible li a.disabled:visible').length === 0);
	} else if (SITE_VERSION === SITE_VERSION_4) {
		return !$('#mini-track-name').hasClass('noClick');
	}
}


// function that returns title of current song
function LFM_TRACK_TITLE() {
	if (SITE_VERSION === SITE_VERSION_6) {
		return $('.metadata:visible span.link:eq(1)').text();
	} else if (SITE_VERSION === SITE_VERSION_4) {
		return $('#mini-track-name').text();
	}
}

// function that returns artist of current song
function LFM_TRACK_ARTIST() {
	if (SITE_VERSION === SITE_VERSION_6) {
		return $('.metadata:visible span.link:eq(0)').text();
	} else if (SITE_VERSION === SITE_VERSION_4) {
		return $('#mini-artist-name').text();
	}}

// function that returns artist of current song
function LFM_TRACK_ALBUM() {
	return false; // currently no way to get name of currently playing track
}

// function that returns duration of current song in seconds
// called at begining of song
function LFM_TRACK_DURATION() {
	var durationArr;
	if (SITE_VERSION === SITE_VERSION_6) {
		durationArr = $('#progressContainer span:first').text().split(':');
	} else if (SITE_VERSION === SITE_VERSION_4) {
		durationArr = $('#progress-total').text().split(':');
	}
	return parseInt(durationArr[0], 10)*60 + parseInt(durationArr[1], 10);
}


/********* Connector: ***********/

var LFM_lastTrack = '';
var LFM_isWaiting = 0;

var title, artist, duration, album, newTrack, isASong;

function LFM_updateNowPlaying(){
	// Acquire data from page
	title = LFM_TRACK_TITLE();
	artist = LFM_TRACK_ARTIST();
	duration = LFM_TRACK_DURATION();
	album = LFM_TRACK_ALBUM();
	newTrack = title + '' + artist;
	isASong = LFM_IS_A_SONG();
	console.log('=====================================================================');
	console.log(title, artist, duration, album, newTrack, isASong);
	console.log('=====================================================================');

	// Update scrobbler if necessary
	if (isASong && newTrack != ' ' && newTrack != LFM_lastTrack){
		if (duration === 0) {
			// Nasty workaround for delayed duration visiblity with skipped tracks.
			setTimeout(LFM_updateNowPlaying, 5000);
			return 0;
		}
		console.log('=====================================================================');
		console.log('submitting a now playing request. artist: '+ artist + ', title: '+ title +', duration: ' + duration);
		console.log('=====================================================================');
		LFM_lastTrack = newTrack;
		chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title}, function(response) {
			if (response !== false) {
				if (album) { // only if we really have an album again sometime
					chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: title, duration: duration, album: album});
				} else {
					chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: title, duration: duration});
				}
			} else { // on failure send nowPlaying 'unknown song'
				chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
			}
		});
	}
	LFM_isWaiting = 0;
}

// Run at startup
$(function(){
	console.log('=====================================================================');
	console.log('Slacker LAST.FM Scrobbler module starting up');
	if ($('section').length > 0) {
		SITE_VERSION = SITE_VERSION_6;
	} else {
		SITE_VERSION = SITE_VERSION_4;
	}
	console.log('Slacker LAST.FM Scrobbler for Site Version ' + SITE_VERSION);
	console.log('=====================================================================');
	$(LFM_WATCHED_CONTAINER()).live('DOMSubtreeModified', function() {
		
		if ($(LFM_WATCHED_CONTAINER).length > 0) {
			if(LFM_isWaiting === 0){
				LFM_isWaiting = 1;
				setTimeout(LFM_updateNowPlaying, 10000);
			}
			return;
		}
	});

	$(window).unload(function() {
		chrome.runtime.sendMessage({type: 'reset'});
		return true;
	});
});
