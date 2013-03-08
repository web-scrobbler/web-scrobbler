/*
 * Chrome-Last.fm-Scrobbler Pandora.com "new interface" Connector
 * 
 * Jordan Perr --- http://jperr.com --- jordan[at]jperr[dot]com
 *
 * You can use this as a template for other connectors.
 */


/* code ganked from youtube.js (perhaps these should be in a util file?) */

/**
 * Trim whitespaces from both endings of the string
 */
function trim(str) {
   return str.replace(/^\s+|\s+$/g, '');
}


/**
 * Find first occurence of possible separator in given string
 * and return separator's position and size in chars or null
 */
function findSeparator(str) {
   // care - minus vs hyphen
   var separators = [' - ', ' – ', '-', '–', ':'];

   for (i in separators) {
      var sep = separators[i];
      var index = str.indexOf(sep);
      if (index > -1)
         return { index: index, length: sep.length };
   }

   return null;
}

/**
 * Parse given string into artist and track, assume common order Art - Ttl
 * @return {artist, track}
 */
function parseInfo(artistTitle) {
   var artist = '';
   var track = '';

   var separator = findSeparator(artistTitle);
   if (separator == null)
      return { artist: '', track: '' };

   artist = artistTitle.substr(0, separator.index);
   track = artistTitle.substr(separator.index + separator.length);

   return cleanArtistTrack(artist, track);
}


/**
 * Clean non-informative garbage from title
 */
function cleanArtistTrack(artist, track) {

   // Do some cleanup
   artist = artist.replace(/^\s+|\s+$/g,'');
   track = track.replace(/^\s+|\s+$/g,'');

   // Strip crap
   track = track.replace(/\s*\*+\s?\S+\s?\*+$/, ''); // **NEW**
   track = track.replace(/\s*\[[^\]]+\]$/, ''); // [whatever]
   track = track.replace(/\s*\([^\)]*version\)$/i, ''); // (whatever version)
   track = track.replace(/\s*\.(avi|wmv|mpg|mpeg|flv)$/i, ''); // video extensions
   track = track.replace(/\s*(of+icial\s*)?(music\s*)?video/i, ''); // (official)? (music)? video
   track = track.replace(/\s*\(\s*of+icial\s*\)/i, ''); // (official)
   track = track.replace(/\s*\(\s*[0-9]{4}\s*\)/i, ''); // (1999)
   track = track.replace(/\s+\(\s*(HD|HQ)\s*\)$/, ''); // HD (HQ)
   track = track.replace(/\s+(HD|HQ)\s*$/, ''); // HD (HQ)
   track = track.replace(/\s*video\s*clip/i, ''); // video clip
   track = track.replace(/\s+\(?live\)?$/i, ''); // live
   track = track.replace(/\(\s*\)/, ''); // Leftovers after e.g. (official video)
   track = track.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // Artist - The new "Track title" featuring someone
   track = track.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // 'Track title'
   track = track.replace(/^[\/\s,:;~-]+/, ''); // trim starting white chars and dash
   track = track.replace(/[\/\s,:;~-]+$/, ''); // trim trailing white chars and dash

   return {artist: artist, track: track};
}


/********* Configuration: ***********/

// changes to the DOM in this container will trigger an update.
LFM_WATCHED_CONTAINER = "div#portablecontrols";

// function that returns title of current song
function LFM_TRACK_TITLE() {
	var info = parseInfo($("div#portablecontrols h3").html());
    return info.track;
}

// function that returns artist of current song
function LFM_TRACK_ARTIST() {
	var info = parseInfo($("div#portablecontrols h3").html());
    return info.artist;
}

// function that returns duration of current song in seconds
// called at begining of song
function LFM_TRACK_DURATION() {
	durationArr = $("span.elapsed").html().split(" - ")[1].split(":");
	return parseInt(durationArr[0])*60 + parseInt(durationArr[1]);
}


/********* Connector: ***********/

var LFM_lastTrack = "";
var LFM_isWaiting = 0;

function LFM_updateNowPlaying(){
	// Acquire data from page
	title = LFM_TRACK_TITLE();
	artist = LFM_TRACK_ARTIST();
	duration = LFM_TRACK_DURATION();
	newTrack = title + " " + artist;
	// Update scrobbler if necessary
	if (newTrack != "" && newTrack != LFM_lastTrack){
		if (duration == 0) {
			// Nasty workaround for delayed duration visiblity with skipped tracks.
			setTimeout(LFM_updateNowPlaying, 5000);
			return 0;
		}
		console.log("submitting a now playing request. artist: "+artist+", title: "+title+", duration: "+duration);
		LFM_lastTrack = newTrack;
		chrome.extension.sendRequest({type: 'validate', artist: artist, track: title}, function(response) {
			if (response != false) {
				chrome.extension.sendRequest({type: 'nowPlaying', artist: artist, track: title, duration: duration});
			} else { // on failure send nowPlaying 'unknown song'
				chrome.extension.sendRequest({type: 'nowPlaying', duration: duration});
			}
		});
	}	
	LFM_isWaiting = 0;
}

// Run at startup
$(function(){
	console.log("redditplayer module starting up");

	$(LFM_WATCHED_CONTAINER).live('DOMSubtreeModified', function(e) {
		//console.log("Live watcher called");
		if ($(LFM_WATCHED_CONTAINER).length > 0) {
			if(LFM_isWaiting == 0){
				LFM_isWaiting = 1;
				setTimeout(LFM_updateNowPlaying, 10000);
			}
			return;    
		}
	});

	$(window).unload(function() {      
		chrome.extension.sendRequest({type: 'reset'});
		return true;      
	});
});
