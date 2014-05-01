window._ATTACHED = window._ATTACHED || false;
window._SCROBBLE_PRIVATE_TRACKS = false;

var options;
var current = {
    title: null
};

/**
 * Parse given string into artist and track, assume common order Art - Ttl
 * @return {artist, track}
 */
function parseInfo(artistTitle) {
    var artist = '';
    var track = '';

    var separator = findSeparator(artistTitle);
    if (separator == null)
        return {
            artist: '',
            track: ''
        };

    artist = artistTitle.substr(0, separator.index);
    track = artistTitle.substr(separator.index + separator.length);

    return cleanArtistTrack(artist, track);
}

/**
 * Find first occurence of possible separator in given string
 * and return separator's position and size in chars or null.
 */
function findSeparator(str) {
    // care - minus vs hyphen.
    var separators = [' - ', ' – ', '-', '–', ':'];

    // check the string for match.
    for (i in separators) {
        var sep = separators[i];
        var index = str.indexOf(sep);
        if (index > -1)
            return {
                index: index,
                length: sep.length
            };
    }

    return null;
}

/**
 * Clean non-informative garbage from title
 */
function cleanArtistTrack(artist, track) {
    // Do some cleanup
    artist = artist.replace(/^\s+|\s+$/g, '');
    track = track.replace(/^\s+|\s+$/g, '');

    // Strip crap
    track = track.replace(/^\d+\.\s*/, ''); // 01.
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

    return {
        artist: artist,
        track: track
    };
}

/**
 * Clean the metadata.
 */
var cleanMetadata = function(metadata) {
    // Sometimes the artist name is in the track title.
    // e.g. Tokyo Rose - Zender Overdrive by Aphasia Records.
    var data = parseInfo(metadata.title);

    // If not, use the username.
    if (data.artist === '') {
        data.track = metadata.title;
        data.artist = metadata.user.username;
    }

    // Add duration (convert ms to seconds).
    data.duration = Math.floor(metadata.duration / 1000);

    // return clean metadata object.
    return data;
};

// Send audio info to the scrobbler.
function updateNowPlaying(metadata) {
    // Exit if private tracks shouldn't be scrobbled.
    if (!window._SCROBBLE_PRIVATE_TRACKS && ("sharing" in metadata) && metadata.sharing == "private") return;

    // Exit on un-pausing.
    if (metadata.title === current.title) return;
    current.title = metadata.title;

    setTimeout(function() {
        // Prepare data.
        var data = cleanMetadata(metadata);

        // Initialize connection
        chrome.runtime.sendMessage({
            type: 'reset'
        });
        // Send information.
        chrome.runtime.sendMessage({
                type: 'validate',
                artist: data.artist,
                track: data.track
            },
            function(response) {
                current.validated = response;
                if (response !== false) {
                    chrome.runtime.sendMessage({
                        type: 'nowPlaying',
                        artist: response.artist,
                        track: response.track,
                        duration: data.duration
                    });
                } else {
                    chrome.runtime.sendMessage({
                        type: 'nowPlaying',
                        duration: data.duration
                    });
                }
            });
    }, 500);
}


/**
 * Run at initialisation; add dom script and attach events.
 */
(function() {
    // Exit if already attached.
    if (window._ATTACHED) return;

    // Inject script to extract events from the Soundcloud API event-bus.
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('connectors/soundcloud-dom-inject.js');
    s.onload = function() {
        this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(s);

    // Trigger functions based on message type.
    function eventHandler(e) {
        switch (e.data.type) {
            case 'SC_PLAY':
                updateNowPlaying(e.data.metadata);
                break;
            case 'SC_PAUSE':
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
    function(request, sender, sendResponse) {
        switch (request.type) {

            // background calls this to see if the script is already injected
            case 'ping':
                sendResponse(true);
                break;
        }
    }
);