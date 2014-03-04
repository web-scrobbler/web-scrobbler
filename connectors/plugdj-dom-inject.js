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
        plugdjAPI.on(plugdjAPI.DJ_ADVANCE, function (plugdj_event) {
            console.log('Recieved DJ API event %o', plugdj_event);
            var mediaObject = plugdj_event == null ? null : plugdj_event.media;
            chromeLastFMUpdateNowPlaying(mediaObject);
        });

        // wait for DJ to load, to recieve song which is playing when user joins the room
        var loadInterval = setInterval(function(){
            var dj = API.getDJ();

            if(typeof(dj) == 'object' && typeof(dj.id) != 'undefined') {
                console.log('Startup media %o', API.getMedia());
                chromeLastFMUpdateNowPlaying(API.getMedia());
                clearInterval(loadInterval);
            } else {
                console.log('Waiting for DJ');
            }
        }, 1000);

    }
}

chromeLastFMinit();