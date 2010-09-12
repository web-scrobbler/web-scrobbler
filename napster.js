const NEW_WAIT_TIME = 10 * 1000;
const N_TRUE = 1;
const N_FALSE = 0;

const SLEEP_TIME = 1000;

function mytime() {
  var date = new Date()
  return date.getTime();
}

function debug(text) {
  console.log('ChromeNapsterScrobbler: ' + text);
}

function songInfo() {
  return "A: " + localStorage.napster_artist
    + ";T: " + localStorage.napster_track
    + ";B: " + localStorage.napster_album;
}

function cleanTag(text) {
  var t = text;
  t = t.replace(/\[[^\]]+\]$/, ''); // [whatever]
  return t;
}

function getNapsterPlayerInfo() {
  // Get artist and song names
  var pb = document.getElementById('progressbar');
  var artist = pb.getElementsByClassName('artistName')[0].firstChild.text;
  var track = pb.getElementsByClassName('songName')[0].firstChild.nodeValue;
  // Get album name
  var pah = document.getElementById('playerAlbumHover');
  var album = pah.getElementsByClassName('albumArt')[0].getAttribute('title');

  // Calculate play time
  var t = pb.getElementsByClassName('timeShow')[0].firstChild.nodeValue;
  var time, duration;
  var tt = /(..):(..) \/ (..):(..)/(t);
  if (tt != null) {
    time = Number(tt[1]*60) + Number(tt[2])
    duration = Number(tt[3]*60) + Number(tt[4])
  } else {
    time = duration = -1;
  }

  if (time >= 0  && artist != '' && track != '') {
    if (artist != localStorage.napster_artist || track != localStorage.napster_track
        || album != localStorage.napster_album || duration != localStorage.napster_duration
        || time < localStorage.napster_time) {
      // New song
      localStorage.napster_flaggedNew = N_TRUE;
      localStorage.napster_seenNew = mytime();
      localStorage.napster_submitted = N_FALSE;
            
      localStorage.napster_artist = artist;
      localStorage.napster_album = album;
      localStorage.napster_track = track;
      localStorage.napster_duration = duration;

      console.log('Detected new song (' + localStorage.napster_seenNew + '): ' + songInfo() + ' | T: ' + t);
    }

    // Update play time
    localStorage.napster_time = time;
  }
}

function shouldSubmit() {
  if (localStorage.napster_submitted == N_FALSE &&
      localStorage.napster_time > 30 &&
      localStorage.napster_time > Math.min(240, localStorage.napster_duration / 2)) {
    return true;
  } else {
    return false;
  }
}

function initStorage() {
  if (localStorage.napster_artist == null) {
    // We need to store this information across pages as browsing the site resets the state otherwise
    localStorage.napster_artist = '';
    localStorage.napster_track = '';
    localStorage.napster_album = '';
    localStorage.napster_duration = -1;
    localStorage.napster_flaggedNew = N_FALSE;
    localStorage.napster_seenNew = mytime();
    localStorage.napster_submitted = N_FALSE;
    notify('Initialized');
  }
}

function init() {

  debug('Initialized');
  initStorage();

  setInterval(function() {
    getNapsterPlayerInfo();
    if (localStorage.napster_flaggedNew == N_TRUE && (mytime() - localStorage.napster_seenNew) >= NEW_WAIT_TIME) {
      debug('Registering Now Playing');
      localStorage.napster_flaggedNew = N_FALSE;
      chrome.extension.sendRequest({type: 'nowPlaying',
                                    artist: localStorage.napster_artist,
                                    track: cleanTag(localStorage.napster_track),
                                    album: cleanTag(localStorage.napster_album),
                                    duration: localStorage.napster_duration});
    }
    if (localStorage.napster_flaggedNew == N_FALSE && shouldSubmit()) {
      debug('Scrobbling');
      localStorage.napster_submitted = N_TRUE;
      chrome.extension.sendRequest({type: 'submit'});
    }
  }, SLEEP_TIME);
}

// Only initialize for pages that are not the Flash player window
if (document.location.href.match('^http://music\.napster\.com/coolplayer/') == null) {
  init();
}
