function chromeLastFMUpdateNowPlaying() {
    var spotify_context = context;

    if (!spotify_context) {
        // Spotify context is not started yet, poll for it.
        setTimeout(function () {
            chromeLastFMUpdateNowPlaying()
        }, 1000);
    } else {
        context.addEventListener("play", function (e) {
            console.log(this);
            if (duration) {
                var songInfo = {'title':'toto', 'artist':'toto', 'duration':'toto'};
                var commDiv = document.getElementById('chromeLastFM');
                // commDiv.innerText = JSON.stringify(songInfo);
            }
        });
    }
}
chromeLastFMUpdateNowPlaying();
