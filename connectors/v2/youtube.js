'use strict';

/* global Connector, YoutubeFilter */

var scrobbleMusicOnly = false;
chrome.storage.local.get('Connectors', function(data) {
	if (data && data.Connectors && data.Connectors.YouTube) {
		var options = data.Connectors.YouTube;
		if (options.scrobbleMusicOnly === true) {
			scrobbleMusicOnly = true;
		}

		console.log('connector options: ' + JSON.stringify(options));
	}
});

Connector.playerSelector = '#page';

Connector.artistTrackSelector = '#eow-title';

/**
 * Because player can be still present in the page, we need to detect that it's invisible
 * and don't return current time. Otherwise resulting state may not be considered empty.
 */
Connector.getCurrentTime = function() {
	if (isPlayerOffscreen()) {
		return null;
	}

	var $time = $('#player-api .ytp-time-current');
	return this.stringToSeconds($time.text());
};

/**
 * Because player can be still present in the page, we need to detect that it's invisible
 * and don't return duration. Otherwise resulting state may not be considered empty.
 */
Connector.getDuration = function() {
	if (isPlayerOffscreen()) {
		return 0;
	}

	var $duration = $('#player-api .ytp-time-duration');
	return this.stringToSeconds($duration.text());
};

Connector.getUniqueID = function() {
	var url = window.location.href;
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[7].length === 11){
		return match[7];
	}
};

Connector.isPlaying = function() {
	return $('#player-api .html5-video-player').hasClass('playing-mode');
};

Connector.isStateChangeAllowed = function() {
	var videoCategory = $('meta[itemprop=\"genre\"]').attr('content');
	return !scrobbleMusicOnly || (scrobbleMusicOnly && videoCategory === 'Music');
};

Connector.getArtistTrack = function () {
	var text =$(Connector.artistTrackSelector).text();

	text = text.replace(/^\[[^\]]+\]\s*-*\s*/i, ''); // remove [genre] from the beginning of the title
	return Connector.splitArtistTrack(text);
};

Connector.filter = YoutubeFilter;

/**
 * YouTube doesn't really unload the player. It simply moves it outside viewport.
 * That has to be checked, because our selectors are still able to detect it.
 */
function isPlayerOffscreen() {
	var $player = $('#player-api');
	if ($player.length === 0) {
		return false;
	}

	var offset = $player.offset();
	return offset.left < 0 || offset.top < 0;
}
