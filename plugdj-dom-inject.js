/**
 * Listen to a "play" event and communicate the current song to the extension
 * via a Json string in a DOM node.
 *
 * @author Anton Stroganov <stroganov.a@gmail.com>
 */
function chromeLastFMUpdateNowPlaying(mediaObject) {
    "use strict";

    var commDiv = document.getElementById('chromeLastFM'),
        message = null;

    if(mediaObject != null) {
        message = {
            'track': mediaObject.title,
            'artist': mediaObject.author,
            'duration': mediaObject.duration
        };
    } else {
        message = {
            'pause': true
        }
    }

    commDiv.innerText = JSON.stringify(message);
}

function chromeLastFMinit() {
    "use strict";

    var plugdjAPI = window.API;

    if (!plugdjAPI) {
        // Plug.DJ context is not started yet, poll for it.
        setTimeout(function () {
            chromeLastFMinit();
        }, 1000);
    } else {

        // subscrive to song change event
        plugdjAPI.addEventListener(plugdjAPI.DJ_ADVANCE, function (plugdj_event) {
            var mediaObject = plugdj_event == null ? null : plugdj_event.media;
            chromeLastFMUpdateNowPlaying(mediaObject);
        });

        // getMedia() will return your next queued media object if nobody is playing
        // so let's make sure that a DJ is performing, then send currently playing 
        // song info
        if(API.getDJs().length > 0) {
            chromeLastFMUpdateNowPlaying(API.getMedia());
        }
    }
}

chromeLastFMinit();