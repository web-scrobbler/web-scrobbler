const INIT_LOAD_DELAY = 5 * 1000;

const NEW_WAIT_TIME = 10 * 1000;
const N_TRUE = 1;
const N_FALSE = 0;

const SLEEP_TIME = 1000;

function mytime() {
  var date = new Date()
  return date.getTime();
}

function debug(text) {
  console.log('ChromeGoogleMusicScrobbler: ' + text);
}

function songInfo() {
  return "A: " + localStorage.google_artist
    + ";T: " + localStorage.google_track
    + ";B: " + localStorage.google_album;
}

function cleanTag(text) {
  var t = text;
  t = t.replace(/\[[^\]]+\]$/, ''); // [whatever]
  return t;
}

function getGooglePlayerInfo() {
    // Get artist and song names
    var artistParent = document.getElementById('playerArtist');
    var trackParent = document.getElementById('playerSongTitle');

    if (artistParent != null) {
  
	var artist = artistParent.getElementsByClassName('fade-out-content')[0].getAttribute('title');
	var track = trackParent.getElementsByClassName('fade-out-content')[0].getAttribute('title');

	// Get album name todo
	var album = "";

	// Calculate play time
	var time, duration;
	var timeValue = document.getElementById('currentTime').innerHTML;
	var durationValue = document.getElementById('duration').innerHTML;
  
	var tttime = timeValue.match(/(\d?\d):?(\d?\d?)/);
	var ttduration = durationValue.match(/(\d?\d):?(\d?\d?)/);
  
	if (tttime != null) {
	    time = Number(tttime[1]*60) + Number(tttime[2])
	    duration = Number(ttduration[1]*60) + Number(ttduration[2])
	} else {
	    time = duration = -1;
	}

	if (time >= 0  && artist != '' && track != '') {
	    if (artist != localStorage.google_artist || track != localStorage.google_track
		|| album != localStorage.google_album || duration != localStorage.google_duration
		|| time < localStorage.google_time) {
		
		// New song
		localStorage.google_flaggedNew = N_TRUE;
		localStorage.google_seenNew = mytime();
		localStorage.google_submitted = N_FALSE;
            
		localStorage.google_artist = artist;
		localStorage.google_album = album;
		localStorage.google_track = track;
		localStorage.google_duration = duration;

		console.log('Detected new song (' + localStorage.google_seenNew + '): ' + songInfo() + ' | T: ' + time);
	    }

	    // Update play time
	    localStorage.google_time = time;
	}
    }
}

function shouldSubmit() {
    if (localStorage.google_submitted == N_FALSE &&
	localStorage.google_time > 30 &&
	localStorage.google_time > Math.min(240, localStorage.google_duration / 2)) {
	return true;
    } 
    else {
	return false;
    }
}

function initStorage() {
    if (localStorage.google_artist == null) {
    
	// We need to store this information across pages as browsing the site resets the state otherwise
	localStorage.google_artist = '';
	localStorage.google_track = '';
	localStorage.google_album = '';
	localStorage.google_duration = -1;
	localStorage.google_flaggedNew = N_FALSE;
	localStorage.google_seenNew = mytime();
	localStorage.google_submitted = N_FALSE;
	//notify('Initialized');
    }
}

function init() {

    debug('Initialized');
  
    initStorage();

    setInterval(function() {
	getGooglePlayerInfo();
	if (localStorage.google_flaggedNew == N_TRUE && (mytime() - localStorage.google_seenNew) >= NEW_WAIT_TIME) {
	    debug('Registering Now Playing');
	    localStorage.google_flaggedNew = N_FALSE;
	    chrome.extension.sendRequest({type: 'nowPlaying',
                                    artist: localStorage.google_artist,
                                    track: cleanTag(localStorage.google_track),
                                    album: cleanTag(localStorage.google_album),
                                    duration: localStorage.google_duration});
	}
	if (localStorage.google_flaggedNew == N_FALSE && shouldSubmit()) {
	    debug('Scrobbling');
	    localStorage.google_submitted = N_TRUE;
	    chrome.extension.sendRequest({type: 'submit'});
	    // @@@ We should check that this succeeded, or even better, implement a queue in scrobbler.js
	}
    }, SLEEP_TIME);
}


// Delay initialization so that player is loaded
setTimeout(function() { init() }, INIT_LOAD_DELAY);
