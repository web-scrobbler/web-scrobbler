var lastTrack = '';
var startTime = 0;

setInterval(function () {
    if (!ge('top_audio_player')) return; // no player
    if (ge('top_audio_player').getAttribute('class').indexOf('top_audio_player_playing') < 0) return; // not playing (paused)
    var current_track = document.querySelectorAll('[data-is-current="1"]')[0];
    var artist = current_track.getAttribute('data-performer');
    var title = current_track.getAttribute('data-title');
    var duration = current_track.getAttribute('data-duration');
    
    var now = new Date().getTime();
    var isNewPlaying = (lastTrack != artist + ' ' + title) || /* new artist-title pair or */
            ((lastTrack == artist + ' ' + title) && ((now - startTime) > 1000 * duration)); /* repeated playing of same track */
    
    if (isNewPlaying) {
        lastTrack = artist + ' ' + title;
        startTime = now;
        window.postMessage({artist: artist, title: title, duration: duration}, '*');
    }
    
}, 1000);
