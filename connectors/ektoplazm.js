/**
 * Chrome-Last.fm-Scrobbler - Ektoplazm connector
 * @author Ben Slote <bslote@gmail.com>
 * Based on the soundcloud connector by Jeppe Hasseriis - https://github.com/cenobitedk
 */

var current = {
    title: null
};

// Send audio info to the scrobbler.
function updateNowPlaying(metadata) {
    // Exit on un-pausing.
    if (metadata.title === current.title) return;
    current.title = metadata.title;

    setTimeout(function() {
        // Prepare data.
        var data = metadata;

        // Initialize connection
        chrome.runtime.sendMessage({
            type: 'reset'
        });
        // Send information.
        chrome.runtime.sendMessage({
                type: 'validate',
                artist: data.artist,
                track: data.title
            },
            function(response) {
                current.validated = response;
                if (response !== false) {
                    chrome.runtime.sendMessage({
                        type: 'nowPlaying',
                        artist: response.artist,
                        track: response.track,
                        //duration: data.duration
                    });
                } else {
                    chrome.runtime.sendMessage({
                        type: 'nowPlaying',
                        //duration: data.duration
                    });
                }
            });
    }, 500);
}

(function() {
    if (window._ATTACHED) return;

    // Inject script to extract events from the Soundcloud API event-bus.
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('connectors/ektoplazm-dom-inject.js');
    s.onload = function() {
        this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(s);

    // Trigger functions based on message type.
    function eventHandler(e) {
        switch (e.data.type) {
            case 'EKTO_PLAY':
                updateNowPlaying(e.data.metadata);
                break;
            case 'EKTO_STOP':
                chrome.runtime.sendMessage({
                    type: 'reset'
                });
                break;
            default:
                break;
        }
    }

    // Attach listener for message events.
    window.addEventListener('message', eventHandler);
    window._ATTACHED = true;

    // Add reset event trigger.
    $(window).unload(function() {
        chrome.runtime.sendMessage({
            type: 'reset'
        });
        return true;
    });
})();

/**
 * Listen for requests from scrobbler.js
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {

            // background calls this to see if the script is already injected
            case 'ping':
                sendResponse(true);
                break;
        }
    }
);

