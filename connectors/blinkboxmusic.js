/*
 * Chrome-Last.fm-Scrobbler blinkboxmusic.com Connector by Malachi Soord
 *                (based on George Pollard's bandcamp connctor)
 * v0.1
 */
'use strict';

var lastTrack = null;

$(function () {
	// bind page unload function to discard current "now listening"
	cancel();
});

var durationElapsed = '.time-stamps > .current';
var durationTotal = '.time-stamps > .total';
var durationRegex = /(\d+):(\d+)/;

function parseDuration(elapsed, total) {
	try {
		var mEla = durationRegex.exec(elapsed);
		var mTot = durationRegex.exec(total);
		return {
			current: parseInt(mEla[1], 10) * 60 + parseInt(mEla[2], 10),
			total: parseInt(mTot[1], 10) * 60 + parseInt(mTot[2], 10)
		};
	} catch (err) {
		return 0;
	}
}

function parseArtist() {
	return $('.track-name-block > .track-artist').text();
}

function parseTitle() {
	return $('.track-name-block > .track-name').text();
}


function cancel() {
	$(window).unload(function () {
		// reset the background scrobbler song data
		chrome.runtime.sendMessage({
			type: 'reset'
		});
		return true;
	});
}

console.log('blinkboxmusic.com: loaded');

$(durationElapsed).live('DOMSubtreeModified', function () {

	var duration = parseDuration($(durationElapsed).text(), $(durationTotal).text());

	// console.log('duration - ' + duration.current + ' / ' + duration.total);

	if (duration.current > 0) { // it's playing

		var artist = parseArtist();
		var track = parseTitle();

		if (lastTrack !== track) {
			lastTrack = track;

			console.log('blinkboxmusic.com: scrobbling - Artist: ' + artist + '; Album:  N/A; Track: ' + track + '; duration: ' + duration.total);
			chrome.runtime.sendMessage({
				type: 'validate',
				artist: artist,
				track: track
			}, function (response) {
				if (response !== false) {
					chrome.runtime.sendMessage({
						type: 'nowPlaying',
						artist: response.artist,
						track: response.track,
						duration: duration.total
					});
				} else {
					chrome.runtime.sendMessage({
						type: 'nowPlaying',
						duration: duration.total
					});
				}
			});
		}
	}
});
