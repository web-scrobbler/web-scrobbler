/**
 * Listen to a "play" event and communicate the current song to the extension
 * via a Json string in a DOM node.
 *
 * @author Damien ALEXANDRE <dalexandre@jolicode.com>
 */
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
            if (context._currentTrack && !context._currentTrack.advertisement) {
                var songInfo = {
                    'title': context._currentTrack.name,
                    'artist': context._currentTrack.artists[0].name,
                    'duration': parseInt(context._currentTrack.duration / 1000, 10)
                };
                var commDiv = document.getElementById('chromeLastFM');
                commDiv.innerText = JSON.stringify(songInfo);
            }
        });

        spotify_context.addEventListener("pause", function () {
            var commDiv = document.getElementById('chromeLastFM');
            commDiv.innerText = JSON.stringify({
                'pause': true
            });
        });
    }
}
chromeLastFMUpdateNowPlaying();
