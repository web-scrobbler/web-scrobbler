/**
 * Connector for RadioPlayer enabled streams (http://www.radioplayer.co.uk/)
 * Made by Jiminald
 * Based loosely on the Google Music connector by Sharjeel Aziz
 * Reworked by gerjomarty
 *
 * To update the inject list, Open a RadioPlayer, view the A-Z list, and run the following command below
 * function onlyUnique(value, index, self) { return self.indexOf(value) === index; } var list = new Array(); $('.overlay-item-link').each(function(i, v){ var url = $(v).attr('href'); url = url.substring(7); url = url.substring(0, url.indexOf('/')); list.push('*://'+url+'/*'); }); list = list.filter(onlyUnique); console.log(JSON.stringify(list));
 */

// Used to remember last song title and not scrobble if it is the same
var lastArtist = '';
var lastTrack = '';

// As there is no time, we default to 90 seconds (Saves 2 alerts popping up on track change)
var DEFAULT_TIMEOUT = 90;

// Config for mutation observers
var config = {childList: true, subtree: true, attributes: true};

// Artist and title are shown in scrolling text in the header
var CONTAINER = '#live-strip';
var TRACK_ELEMENT = '#live-strip .scrolling-text';

/**
 * Call the specified function when the container contents change.
 */
if ($(CONTAINER).length > 0) {
    var target = document.querySelector(CONTAINER);
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(updateTrack);
    });

    observer.observe(target, config);
}

/**
 * Reset the currently playing song if the window is unloaded.
 */
$(window).unload(function() {
    chrome.runtime.sendMessage({type: 'reset'});
    return true;
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

function updateTrack() {
    var artist = '';
    var track = '';

    var text = $(TRACK_ELEMENT).text();

    text = text.replace(/\(\d+:\d+\)(.)*?/g , "");

    // Figure out where to split; use " - " rather than "-"
    if (text.indexOf(' - ') > -1) {
        artist = text.substring(text.indexOf(' - ') + 3);
        track = text.substring(0, text.indexOf(' - '));
    } else if (text.indexOf('-') > -1) {
        artist = text.substring(text.indexOf('-') + 1);
        track = text.substring(0, text.indexOf('-'));
    } else if (text.indexOf(':') > -1) {
        artist = text.substring(text.indexOf(':') + 1);
        track = text.substring(0, text.indexOf(':'));
    } else {
        // can't parse
        return;
    }

    artist = artist.replace(/^\s+|\s+$/g,'');
    track = track.replace(/^\s+|\s+$/g,'');

    scrobbleTrack(artist, track, DEFAULT_TIMEOUT);
}

function scrobbleTrack(artist, track, duration) {
    if (artist === '' || track === '' || (lastArtist === artist && lastTrack === track)) {
        // Don't scrobble if we have missing data, or if we've already scrobbled the track.
        return;
    }

    lastArtist = artist;
    lastTrack = track;

    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
        if (response !== false) {
            chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: track, duration: duration});
        }
    });
}
