'use strict';

/* global Connector */
	var artist = null;
	var track = null;

Connector.playerSelector = '#playerInfo';

Connector.artistSelector = '#current > span.artist'
Connector.trackSelector = '#current > span.song'

Connector.isPlaying = function () {
//	if $('#playerInfo > span').text() == "Jetzt:")
		return true;
//	else
//		return false;
}


function updateNowPlaying() {
    if (artist == "" || track == "" || artist == undefined || track == undefined) {
        console.log("Artist/Track was empty or radio station is in a commercial break.");
        return;
    }
    //validate track info
    chrome.runtime.sendMessage({
        type: 'validate',
        artist: artist,
        track: track
    }, function (response) {
        if (response != false) {
            chrome.runtime.sendMessage({
                type: 'nowPlaying',
                artist: artist,
                track: track,
                duration: duration
            });
            console.log({
                type: 'nowPlaying',
                artist: artist,
                track: track,
                duration: duration
            });
            displayMsg("Scrobbling");
        } else {
            displayMsg("Unable to Scrobble");
            console.log("Last.fm was unable to validate the Artist/Track combination.");
        }
    });
}

