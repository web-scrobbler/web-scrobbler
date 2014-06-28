var lastTrack = '';
var startTime = 0;

setInterval(function () {
    if (!ge('gp_performer')) return; // no player
    if (ge('gp_play').getAttribute('class').indexOf('playing') < 0) return; // not playing (paused)
    var artist = ge('gp_performer').innerText;
    var title = ge('gp_title').innerText;
    var duration = audioPlayer.duration;
    
    var now = new Date().getTime();
    var isNewPlaying = (lastTrack != artist + ' ' + title) || /* new artist-title pair or */
            ((lastTrack == artist + ' ' + title) && ((now - startTime) > 1000 * duration)); /* repeated playing of same track */
    
    if (isNewPlaying) {
        lastTrack = artist + ' ' + title;
        startTime = now;
        window.postMessage({artist: artist, title: title, duration: duration}, '*');
    }
    
}, 5000);
