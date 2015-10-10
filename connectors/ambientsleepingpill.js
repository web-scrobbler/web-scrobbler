/*
 * Chrome-Last.fm-Scrobbler ambientsleepingpill.com Connector by Malachi Soord
 *                (based on George Pollard's Bandcamp connector)
 * v0.1
 */
'use strict';

var lastTrack = null;

$(function() {
	// bind page unload function to discard current 'now listening'
	cancel();
});

function parseArtist() {
	var artist = $('#cc_recenttracks_asp > .cctrack:first-child .ccartist').text();
	return $.trim(artist);
}

function parseAlbum() {
	var album = $('#cc_recenttracks_asp > .cctrack:first-child .ccalbum').text();
	return $.trim(album);
}

function parseTitle() {
	var title = $('#cc_recenttracks_asp > .cctrack:first-child .cctitle').text();
	return $.trim(title);
}

function cancel() {
	$(window).unload(function() {
		// reset the background scrobbler song data
		chrome.runtime.sendMessage({
			type: 'reset'
		});
		return true;
	});
}

// console.log('Ambientsleepingpill: loaded');

$('.jp-play').click(function() {
	scrobble();
});

$('#cc_recenttracks_asp').bind('DOMSubtreeModified', function() {
	if ($('.jp-play').css('display') === 'none') { // it's playing
		scrobble();
	}
});

function scrobble() {
	var artist = parseArtist();
	var track = parseTitle();
	var album = parseAlbum();

	if (lastTrack != track) {
		lastTrack = track;
		// console.log('Ambientsleepingpill: scrobbling - Artist: ' + artist + '; Album:  ' + album + '; Track: ' + track);
		chrome.runtime.sendMessage({
			type: 'validate',
			artist: artist,
			track: track
		}, function(response) {
			if (response !== false) {
				chrome.runtime.sendMessage({
					type: 'nowPlaying',
					artist: response.artist,
					track: response.track,
					album: album
				});
			}
		});
	}
}
