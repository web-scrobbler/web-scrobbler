/**
 * Connector for RadioPlayer enabled streams (http://www.radioplayer.co.uk/)
 * Made by Jiminald
 * Based loosely on the Google Music connector by Sharjeel Aziz
 * Reworked by gerjomarty
 *
 * To update the inject list, Open a RadioPlayer, view the A-Z list, and run the following command below
 * function onlyUnique(value, index, self) { return self.indexOf(value) === index; } var list = new Array(); $('.overlay-item-link').each(function(i, v){ var url = $(v).attr('href'); url = url.substring(7); url = url.substring(0, url.indexOf('/')); list.push('*://'+url+'/*'); }); list = list.filter(onlyUnique); console.log(JSON.stringify(list));
 */

// State for event handlers
var state = 'init';

// Used to remember last song title and not scrobble if it is the same
var lastArtist = '';
var lastTrack = '';

// Timeout to scrobble track ater minimum time passes
var scrobbleTimeout = null;

// As there is no time, we default to 90 seconds (Saves 2 alerts popping up on track change)
var DEFAULT_TIMEOUT = 90;

// Config for mutation observers
var config = {childList: true, subtree: true, attributes: true};

// BBC RadioPlayer stations show their Now Playing in the body
// Others show it in the scrolling text in the head

var BBC_CONTAINER = '#programme-info';
var BBC_NP_ELEMENT = '#realtime:visible';
var BBC_ARTIST_ELEMENT = '#artists';
var BBC_TRACK_ELEMENT = '#track';
var BBC_TRACK_CHILD_ELEMENT = ':not(.more-indicator)';

var OTHER_CONTAINER = '#live-strip';
var OTHER_TRACK_ELEMENT = '#live-strip .scrolling-text';

// Identify BBC pages by their usual HTML structure

if ($(BBC_CONTAINER).length > 0) {
    // BBC station

    var bbcTarget = document.querySelector(BBC_CONTAINER);
    var bbcObserver = new MutationObserver(function(mutations) {
        mutations.forEach(updateBbc);
    });

    bbcObserver.observe(bbcTarget, config);
} else {
    // Other station

    var otherTarget = document.querySelector(OTHER_CONTAINER);
    var otherObserver = new MutationObserver(function(mutations) {
        mutations.forEach(updateOther);
    });

    otherObserver.observe(otherTarget, config);
}

$(window).unload(function() {
    // reset the background scrobbler song data
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

function updateBbc() {
    if ($(BBC_NP_ELEMENT).length > 0) {
        artist = $.trim($(BBC_ARTIST_ELEMENT).text());
        track = '';

        if ($(BBC_TRACK_ELEMENT).children().length > 0) {
            $(BBC_TRACK_ELEMENT).children().each(function() {
                if ($(this).is(BBC_TRACK_CHILD_ELEMENT)) {
                    track += $(this).text();
                }
            });
        } else {
            track = $(BBC_TRACK_ELEMENT).text();
        }

        scrobbleTrack(artist, track, DEFAULT_TIMEOUT);
    }
}

function updateOther() {
    var artist = '';
    var track = '';

    var text = $(OTHER_TRACK_ELEMENT).text();

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
        return;
    }

    lastArtist = artist;
    lastTrack = track;

    console.log("Scrobbled - Artist: " + artist + ", Track: " + track);
    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
        if (response !== false) {
            chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: track, duration: duration});
        }
    });
}
