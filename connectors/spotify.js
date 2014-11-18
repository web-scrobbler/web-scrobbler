/**
 * Spotify Web Player connector
 *
 * TODO: Pause/Resume functionality
 *
 * @author David Sabata
 */
(function ChromeLastFmSpotifyScrobbler($) {
    "use strict";

    /**
     * Last known track uri (internal Spotify API identificator)
     */
    var lastTrackUri = null;




    /**
     * Function to be injected in the document. All it does is forwarding player's api events to the iframe object,
     * where the extension can listen for them
     *
     * CAREFUL : The function will run in the document's context instead of sandbox and there is no jQuery!
     */
    var injectedFunction = function() {
        // we're in document's context, where is no jQuery but some custom implementation of the dollar
        var frame = $('app-player');

        // hook player change events
        frame.addEventListener('load', function() {
            frame.contentWindow.require(['$api/models'], function(models) {
                models.player.addEventListener('change', onPlayerChange);
            });
        });

        // forward all change events to the content script
        var onPlayerChange = function(e) {
            var evt = new CustomEvent('LFM_change', { detail: e.data });
            frame.dispatchEvent(evt);
        };
    };


    /**
     * Process the player's change events
     */
    var updateNowPlaying = function(e) {
        var data = e.detail;
        console.log(data);

        // reset when the playback stops
        if (data.track == null || data.playing != true) {
            lastTrackUri = null;
            chrome.runtime.sendMessage({type:'reset'});
            return;
        }

        // beginning of a new song
        if (data.track.uri != lastTrackUri && !data.track.advertisement) {
            var track = data.track;
            lastTrackUri = track.uri;

            // validate that the object has all the mandatory data, just to be sure
            if (!track.artists || track.artists.length == 0 || !track.artists[0].name || !track.duration || !track.name) {
                return;
            }

            var artist = track.artists[0].name;
            var duration = Math.round(track.duration / 1000); // miliseconds -> seconds
            var album = track.albumName ? track.albumName : null;

            chrome.runtime.sendMessage({'type': 'validate', 'artist': artist, 'track': track.name, album: album}, function (response) {
                if (response !== false) {
                    chrome.runtime.sendMessage({type: 'nowPlaying', 'artist': artist, 'track': track.name, 'duration': duration, album: album});
                } else {
                    // on validation failure send nowPlaying 'unknown song'
                    chrome.runtime.sendMessage({'type': 'nowPlaying', 'duration': duration});
                }
            });
        }

    };




    /**
     * Setup code for the player events forwarding
     */
    $(document).ready(function () {

        // for some reason script node created via jQuery does not execute
        var scriptNode = document.createElement('script');
        scriptNode.type = 'text/javascript';
        scriptNode.text = '(' + injectedFunction + ')();';
        document.body.appendChild(scriptNode);


        // Listen for events from the injected script
        $('#app-player').bind('LFM_change', updateNowPlaying);


        // reset potential "now playing" song when leaving page
        $(window).unload(function () {
            chrome.runtime.sendMessage({type:'reset'});
            return true;
        });

    });




    /**
     * Listen for requests from scrobbler.js
     */
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            switch(request.type) {

                // background calls this to see if the script is already injected
                case 'ping':
                    sendResponse(true);
                    break;
            }
        }
    );

})(jQuery);
