/*
 * Chrome-Last.fm-Scrobbler pitchfork.com/advance Connector by mygoodgomez
 * (based on pitchfork.com Connector by vintitres)
 */

var pfAdvanceScrobbler = {
    trackFrameSel: '#now-playing',
    trackSel: '#track-title',
    timerSel: "#track-timer",
    trackStatusSel: '#track-status span',
    tracksObj: window.stream_tracks,
    lastTrack: ''
};

$(function () {
    // bind page unload function to discard current "now listening"
    pfAdvanceScrobbler.cancel();
});

$(document).ready(function () {
    var pf = window.pfAdvanceScrobbler;
    // while player not loaded on page monitor all changes
    $('body').bind('DOMNodeInserted', function () {
        if ($(pf.trackSel).length) {
            $('body').unbind('DOMNodeInserted');

            // when player loaded monitor track changes
            $(pf.trackFrameSel).bind('DOMNodeInserted', function () {
                if (!$(pf.trackSel).length || $(pf.trackStatusSel).text() != 'Now Playing') {
                    return;
                }
                trackStr = $(pf.trackSel).text();
                if(trackStr === pf.lastTrack) {
                    return;
                }
                pf.lastTrack = trackStr;

                // on new track wait until it starts playing to get duration if
                // available
                $(pf.timerSel).bind('DOMSubtreeModified', function () {
                    $(pf.timerSel).unbind('DOMSubtreeModified');
                    var artist = pf.parseArtist(document.title);
                    var track = $(pf.trackSel).text();
                    chrome.extension.sendRequest({
                            type: 'validate',
                            artist: artist,
                            track: track
                        },
                        function (response) {
                            if (response !== false) {
                                var duration = pf.parseDuration($(pf.timerSel).text());
                                chrome.extension.sendRequest({
                                    type: 'nowPlaying',
                                    artist: artist,
                                    track: track,
                                    duration: duration
                                });
                            }
                        }
                    );
                });
            });
        }
    });
});

pfAdvanceScrobbler.parseDuration = function(match) {
    var duration = 120;
    try {
        match = match.split(' / ')[1];
        var mins    = match.substring(0, match.indexOf(':'));
        var seconds = match.substring(match.indexOf(':') + 1);
        duration = parseInt(mins, 10) * 60 + parseInt(seconds, 10);
    } catch(e) {}
    return duration;
}

pfAdvanceScrobbler.parseArtist = function(titleString) {
    try {
        artist = titleString.split(':')[0];
        return artist;
    } catch (err) {
        return '';
    }    
}
pfAdvanceScrobbler.cancel = function() {
    $(window).unload(function () {
        // reset the background scrobbler song data
        chrome.extension.sendRequest({type: 'reset'});
        return true;
    });
}
