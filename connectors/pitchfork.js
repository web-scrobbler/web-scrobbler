/*
 * Chrome-Last.fm-Scrobbler pitchfork.com Connector by vintitres
 * (based on MySpace.com Connector by Yasin Okumus)
 */

var trackFrameSel = '#player-modal .detail';
var trackSel = trackFrameSel + ' .hgroup h1';
var artistSel = trackFrameSel + ' .hgroup h2';
var durationSel = "#player-modal .time-unplayed";
var playedSel = "#player-modal .time-played";

$(function () {
    // bind page unload function to discard current "now listening"
    cancel();
});

var lastTrack = '';

$(document).ready(function () {
    // while player not loaded on page monitor all changes
    $('body').bind('DOMNodeInserted', function () {
        if ($(trackSel).length) {
            $('body').unbind('DOMNodeInserted');

            // when player loaded monitor track changes
            $(trackFrameSel).bind('DOMNodeInserted', function () {
                // check if wanted change (2 or 3 new elements inserted into
                // trackFrame when new track starts playing, we are
                // interested only once)
                if (!$(trackSel).length) {
                    return;
                }
                trackStr = $(trackSel).text() + $(artistSel).text();
                if(trackStr === lastTrack) {
                    return;
                }
                lastTrack = trackStr;

                // on new track wait until it starts playing to get duration if
                // available
                $(playedSel).bind('DOMSubtreeModified', function () {
                    $(playedSel).unbind('DOMSubtreeModified');
                    var
                        artist = $(artistSel).text(),
                        track = $(trackSel).text().replace(/"|\[|\]/g, '');
                    chrome.extension.sendRequest(
                        {
                            type: 'validate',
                            artist: artist,
                            track: track
                        },
                        function (response) {
                            if (response !== false) {
                                var duration = parseDuration(
                                    $(durationSel).text()
                                );
                                if (duration === 0) {
                                    // some tracks don't have information about
                                    // duration, so we use hardcore AI to
                                    // determine it
                                    duration = 120;
                                }
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

function parseDuration(match) {
    if (match === '--:--') {
        return 0;
    }
    try {
        var
            mins = match.substring(1, match.indexOf(':')),
            seconds = match.substring(match.indexOf(':') + 1);
        return parseInt(mins, 10) * 60 + parseInt(seconds, 10);
    } catch (err) {
        return 0;
    }
}

function cancel() {
    $(window).unload(function () {
        // reset the background scrobbler song data
        chrome.extension.sendRequest({type: 'reset'});
        return true;
    });
}
