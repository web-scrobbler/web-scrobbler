/*
 * Chrome-Last.fm-Scrobbler jango.com connector
 * (c) 2012 Stephen Hamer <stephen.hamer@gmail.com>
 */

// The attach_artist_pic method gets called in the evaluated javascript
// returned when songs are switched to update the pictures associated with the
// artist. This method is used as the trigger for scrobbling the song.
var orig_attach_artist_pic;

function chromeLastFMUpdateNowPlaying(skip_callback){
  var sm = _jp.soundManager;
  var duration = sm.sounds[sm.soundIDs[sm.soundIDs.length - 1]].duration / 1000;

  // We can start updating the attached pics before the sound manager has
  // loaded the track (and knows the duration). If so, poll the sound manager for
  // duration.
  if (duration === 0) {
    setTimeout(function() { chromeLastFMUpdateNowPlaying(true) }, 1000);
  } else {
    var songInfo = {'title': _jm.song_info.song, 'artist': _jm.song_info.artist, 'duration': duration};
    var commDiv = document.getElementById('chromeLastFM');
    commDiv.innerText = JSON.stringify(songInfo);
  }

  // Only call the original method once, don't call it each time we poll the
  // sound manager for the song duration
  if (!skip_callback) {
    orig_attach_artist_pic();
  }
}

function waitUi() {
  //console.log("waiting for _jui");
  if (window["_jui"] === undefined || _jui.jango_player === undefined) {
    setTimeout(waitUi, 1000);
    return;
  }
  orig_attach_artist_pic = _jui.jango_player.attach_artist_pic.bind(_jui.jango_player);
  _jui.jango_player.attach_artist_pic = chromeLastFMUpdateNowPlaying;
}
waitUi();
