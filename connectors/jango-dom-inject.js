/*
 * Chrome-Last.fm-Scrobbler jango.com connector
 * (c) 2012 Stephen Hamer <stephen.hamer@gmail.com>
 */

// The update_song_display method gets called in the evaluated javascript
// returned when songs are switched to update the pictures associated with the
// artist. This method is used as the trigger for scrobbling the song.
var orig_update_song_display;

function chromeLastFMUpdateNowPlaying(skip_callback){
  var sm = _jp.soundManager;

  if (!sm) {
    // The sound manager hasn't loaded yet, poll for it to load so we can get the song details.
    setTimeout(function() { chromeLastFMUpdateNowPlaying(true) }, 1000);

  } else {
    var latest_sound = sm.sounds[sm.soundIDs[sm.soundIDs.length - 1]];

    var duration = null;
    if (latest_sound.bytesLoaded === null || latest_sound.bytesLoaded != latest_sound.bytesTotal) {
      // The soung is still loading, continue to poll for it to load.
      setTimeout(function() { chromeLastFMUpdateNowPlaying(true) }, 5000);
    } else {
      duration = latest_sound.duration / 1000;
    }

    // We can start updating the attached pics before the sound manager has
    // loaded the track (and knows the duration).
    if (duration) {
      var songInfo = {'title': _jm.song_info.song, 'artist': _jm.song_info.artist, 'duration': duration};
      var commDiv = document.getElementById('chromeLastFM');
      commDiv.innerText = JSON.stringify(songInfo);
    }
  }

  // Only call the original method once, don't call it each time we poll the
  // sound manager for the song duration
  if (!skip_callback) {
    orig_update_song_display();
  }
}

function waitUi() {
  //console.log("waiting for _jui");
  if (window["_jui"] === undefined || _jui.jango_player === undefined) {
    setTimeout(waitUi, 1000);
    return;
  }
  orig_update_song_display = _jui.jango_player.update_song_display.bind(_jui.jango_player);
  _jui.jango_player.update_song_display = chromeLastFMUpdateNowPlaying;
}
waitUi();
