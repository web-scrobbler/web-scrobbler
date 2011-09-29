const INIT_LOAD_DELAY = 5 * 1000;

const NEW_WAIT_TIME = 10 * 1000;
const N_TRUE = 1;
const N_FALSE = 0;

const SLEEP_TIME = 1000;

function mytime() {
  var date = new Date()
  return date.getTime();
}

// Logging function which prepends 'ChromeNapsterScrobbler: '
function debug(text, data) {
  if(data)
    console.log('ChromeNapsterScrobbler: ' + text + ': ', data);
  else
    console.log('ChromeNapsterScrobbler: ' + text);
}

// Removes anything in brackets: e.g. [Album], [Explicit], etc.. Napster has a nasty habit of putting random
// data in track and album names that are inappropriate for scrobbling
function cleanTag(text) {
  return text.replace(/\[[^\]]+\]$/, '');
}

// Returns the total seconds played
function getSecondsFromTime(id) 
{
   var time_elem = document.getElementById(id);
   if (time_elem == null) return -1;

   var segments = /(\d+):(\d+)/.exec(time_elem.textContent);
   return segments == null ? -1 : Number(segments[1])*60 + Number(segments[2])
}

function getNapsterPlayerInfo() {
  
  // Get artist, album, track (using the @title attribute to grab the sanitized text values)
  var artist = document.getElementById('nx_artist_name').title;
  var album = document.getElementById('nx_album_name').title;
  var track = document.getElementById('nx_song_name').title;

  // Calculate song play time - after the song data has changed but before the song begins playing (e.g. during the period before 'stream:buffer_full' fires)
  // the duration data is invalid and the time equals "00:00". To accurately handle this, we'll wait for time > 0
  var time = getSecondsFromTime('nx_time_played');

  // If any of the track metadata is invalid, mark that scrobbling has occurred to prevent
  // scrobbing of the current track state and exit
  if(artist == "" || track == "" || album == "" || time <= 0)
  {
     // Mark that scrobbling has occured for the current data to disable scrobbling
     localStorage.napster_submitted == N_TRUE;
     return;
  }
    
  // If the artist, track or album values changed, update the song metadata
  if (artist != localStorage.napster_artist || track != localStorage.napster_track || album != localStorage.napster_album) {

      // New song data
      localStorage.napster_seenNew = mytime();
      localStorage.napster_flaggedNew = N_TRUE;
      localStorage.napster_submitted = N_FALSE;
      localStorage.napster_artist = artist;
      localStorage.napster_album = album;
      localStorage.napster_track = track;
      localStorage.napster_duration = getSecondsFromTime('nx_song_duration');

      debug('Detected new song', {artist: localStorage.napster_artist,
             track: localStorage.napster_track,
             album: localStorage.napster_album,
             duration: localStorage.napster_duration,
             seen: localStorage.napster_seenNew});
  }

  // Update play time
  localStorage.napster_time = time;
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
    localStorage.napster_submitted = N_TRUE; // If the 'submitted' value is true, no action is needed until it's reset to false
  }
}

function init() {

  debug('Initialized');
  initStorage();

  var scrobbleAfter = 240;

  // Data Collection
  setInterval(function() {
    // Collect 'now playing' info from the DOM
    getNapsterPlayerInfo();

    // If the collected info hasn't been sent to the extension and the NEW_WAIT_TIME has elapsed, then call .sendRequest
    if (localStorage.napster_flaggedNew == N_TRUE && (mytime() - localStorage.napster_seenNew) >= NEW_WAIT_TIME) {

      var artWork = null;
   
      for(var i=0;i<=1;i++)
      {
         var trackImage = document.getElementById('nx_large_image_' + i);
         if(trackImage != null && trackImage.src)
         {
            artWork = trackImage.src;
         }
      }

      debug('Registering Now Playing', {artist: localStorage.napster_artist,
             track: localStorage.napster_track,
             album: localStorage.napster_album,
             image: artWork,
             duration: localStorage.napster_duration});

      localStorage.napster_flaggedNew = N_FALSE;
      chrome.extension.sendRequest({type: 'nowPlaying',
                                    artist: localStorage.napster_artist,
                                    track: cleanTag(localStorage.napster_track),
                                    album: cleanTag(localStorage.napster_album),
                                    image: (trackImage == null) ? null : trackImage.src,
                                    duration: localStorage.napster_duration});

      // Scrobble the song after either 240 seconds or half the duration of the song elapses. Further, require songs to be
      // at least 30 seconds long. The min 30 value ensures that songs < 30 will be skipped as scrobbleAfter will never elapse
      scrobbleAfter = Math.min(240, Math.max(30, localStorage.napster_duration / 2));
    }

    // If song has not been submitted the collected info has been sent to the extension and at least 30 seconds have elapsed, then test to see
    // if the minimum amount of time required for scrobbling has elapsed
    if (localStorage.napster_flaggedNew == N_FALSE && localStorage.napster_submitted == N_FALSE && localStorage.napster_time > scrobbleAfter) {
      debug('Scrobbling Song', {artist: localStorage.napster_artist,
             track: localStorage.napster_track,
             album: localStorage.napster_album,
             duration: localStorage.napster_duration,
             played: localStorage.napster_time});

      localStorage.napster_submitted = N_TRUE;
      chrome.extension.sendRequest({type: 'submit'});
      // @@@ We should check that this succeeded, or even better, implement a queue in scrobbler.js
    }
  }, SLEEP_TIME);
}

// Only initialize for pages that are not the Flash player window and when the module is enabled
if (document.location.href.toLowerCase() == 'http://music.napster.com/player/getplayer.htm') {

  // Conditionally enable this module
  chrome.extension.sendRequest({type: "napsterModuleEnabled"}, function(response) {
    if(response && response.enabled)
    {
        // Delay initialization so that player is loaded
        setTimeout(function() { init() }, INIT_LOAD_DELAY);
    }
  });
}
