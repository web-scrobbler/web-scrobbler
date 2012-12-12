function chromeLastFMUpdateNowPlaying() {
    var spotify_context = window.context;

    if (!spotify_context) {
        // Spotify context is not started yet, poll for it.
        setTimeout(function () {
            chromeLastFMUpdateNowPlaying()
        }, 1000);
    } else {
        spotify_context.addEventListener("play", function () {
            var context = this;
            if (this._currentTrack && !this._currentTrack.advertisement) {
                var songInfo = {
                    'title': this._currentTrack.name,
                    'artist': this._currentTrack.artists[0].name,
                    'duration': parseInt(this._currentTrack.duration / 1000, 10)
                };
                var commDiv = document.getElementById('chromeLastFM');
                commDiv.innerText = JSON.stringify(songInfo);
            }
        });
    }
}
chromeLastFMUpdateNowPlaying();
