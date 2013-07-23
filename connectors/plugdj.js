/**
 * Chrome-Last.fm-Scrobbler plug.dj connector
 * @author Anton Stroganov <stroganov.a@gmail.com>
 * Heavily inspired by spotify.js by Damien Alexandre <dalexandre@jolicode.com>, 
 * which was based on jango.js by Stephen Hamer <stephen.hamer@gmail.com>
 */
(function ChromeLastFmPlugDjScrobbler($) {
    "use strict";

    /**
     * Clean non-informative garbage from title
     */
    function cleanArtistTrack(artist, track) {

       // Do some cleanup
       artist = artist.replace(/^\s+|\s+$/g,'');
       track = track.replace(/^\s+|\s+$/g,'');

       // Strip crap
       track = track.replace(/\s*\*+\s?\S+\s?\*+$/, ''); // **NEW**
       track = track.replace(/\s*\[[^\]]+\]$/, ''); // [whatever]
       track = track.replace(/\s*\([^\)]*version\)$/i, ''); // (whatever version)
       track = track.replace(/\s*\.(avi|wmv|mpg|mpeg|flv)$/i, ''); // video extensions
       track = track.replace(/\s*(of+icial\s*)?(music\s*)?video/i, ''); // (official)? (music)? video
       track = track.replace(/\s*\(\s*of+icial\s*\)/i, ''); // (official)
       track = track.replace(/\s*\(\s*[0-9]{4}\s*\)/i, ''); // (1999)
       track = track.replace(/\s+\(\s*(HD|HQ)\s*\)$/, ''); // HD (HQ)
       track = track.replace(/\s+(HD|HQ)\s*$/, ''); // HD (HQ)
       track = track.replace(/\s*video\s*clip/i, ''); // video clip
       track = track.replace(/\s+\(?live\)?$/i, ''); // live
       track = track.replace(/\(\s*\)/, ''); // Leftovers after e.g. (official video)
       track = track.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // Artist - The new "Track title" featuring someone
       track = track.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // 'Track title'
       track = track.replace(/^[\/\s,:;~-]+/, ''); // trim starting white chars and dash
       track = track.replace(/[\/\s,:;~-]+$/, ''); // trim trailing white chars and dash

       return {artist: artist, track: track};
    }

    /**
     * Cache the last song called to avoid multiple calls
     * @type {String}
     */
    var lastSongTitle = '';

    var updateNowPlaying = function() {
        var commDiv = document.getElementById('chromeLastFM'), songInfo, cleanInfo;

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
        if (songInfo.track === lastSongTitle) {
            return;
        }
        lastSongTitle = songInfo.track;

        // the plug.dj sound sources are youtube and soundcloud, which can have dirty track/artist info.
        // clean them up before scrobbling.
        cleanInfo = cleanArtistTrack(songInfo.artist, songInfo.track);
        cleanInfo.duration = songInfo.duration;

        chrome.runtime.sendMessage({'type': 'validate', 'artist': cleanInfo.artist, 'track': cleanInfo.track}, function (response) {
            if (response !== false) {
                chrome.runtime.sendMessage({type: 'nowPlaying', 'artist': cleanInfo.artist, 'track': cleanInfo.track, 'duration': cleanInfo.duration});
            } else {
                // on validation failure send nowPlaying 'unknown song'
                chrome.runtime.sendMessage({'type': 'nowPlaying', 'duration': cleanInfo.duration});
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
            "  })('" + chrome.extension.getURL('connectors/plugdj-dom-inject.js') + "');</script>");

        // Listen for 'messages' from the injected script
        $('#chromeLastFM').bind('DOMSubtreeModified', updateNowPlaying);

        $(window).unload(function () {
            chrome.runtime.sendMessage({type:'reset'});
            return true;
        });
    });
})(jQuery);