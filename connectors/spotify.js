/**
 * Chrome-Last.fm-Scrobbler play.spotify.com connector
 * @author Damien ALEXANDRE <dalexandre@jolicode.com>
 * Heavily inspired by jango.js by Stephen Hamer <stephen.hamer@gmail.com>
 */
(function ChromeLastFmSpotifyScrobbler($) {
    "use strict";

    /**
     * Cache the last song called to avoid multiple calls
     * @type {String}
     */
    var lastSongTitle = '';

    var updateNowPlaying = function() {
        var commDiv = document.getElementById('chromeLastFM'), songInfo;
        
        try {
            songInfo = JSON.parse(commDiv.innerText);
        } catch (e) {
            // Skip malformed communication blobs
            return;
        }

        // If this is a "pause" event, just call the "reset"
        if (songInfo.pause && songInfo.pause === true) {
            lastSongTitle = '';
            chrome.runtime.sendMessage({type: "reset"});
            return;
        }

        // If the title is the same as the previous one, just leave
        if (songInfo.title === lastSongTitle) {
            return;
        }
        lastSongTitle = songInfo.title;

        chrome.runtime.sendMessage({'type': 'validate', 'artist': songInfo.artist, 'track': songInfo.title}, function (response) {
            if (response !== false) {
                chrome.runtime.sendMessage({type: 'nowPlaying', 'artist': songInfo.artist, 'track': songInfo.title, 'duration': songInfo.duration});
            } else {
                // on validation failure send nowPlaying 'unknown song'
                chrome.runtime.sendMessage({'type': 'nowPlaying', 'duration': songInfo.duration});
            }
        });
    };

    $(document).ready(function () {
        // XXX(shamer): we can't directly access the page javascript from the
        // extension. To get code running in the page context we have to add a script tag
        // to the DOM. The script then is executed in the global context.
        // To communicate between the injected JS and the extension a DOM node is updated with the text to send.
        var comNode = $('<div id="chromeLastFM" style="display: none"></div>');
        document.body.appendChild(comNode[0]);

        $('body').append('<script type="text/javascript">(function(l) {\n' +
            "    var injectScript = document.createElement('script');\n" +
            "    injectScript.type = 'text/javascript';\n" +
            "    injectScript.src = l;\n" +
            "    document.getElementsByTagName('head')[0].appendChild(injectScript);\n" +
            "  })('" + chrome.extension.getURL('connectors/spotify-dom-inject.js') + "');</script>");

        // Listen for 'messages' from the injected script
        $('#chromeLastFM').bind('DOMSubtreeModified', updateNowPlaying);

        $(window).unload(function () {
            chrome.runtime.sendMessage({type:'reset'});
            return true;
        });
    });
})(jQuery);
