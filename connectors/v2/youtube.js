'use strict';

/* global Connector, MetadataFilter */

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

Connector.videoSelector = '#player-api .html5-main-video';

Connector.artistTrackSelector = '#eow-title';

Connector.escapeBadTimeValues = function (time) {
	if (typeof time !== 'number') {
		return null;
	}
	if (isNaN(time) || !isFinite(time)) {
		return null;
	}
	return time;
};

/**
 * Because player can be still present in the page, we need to detect that it's invisible
 * and don't return current time. Otherwise resulting state may not be considered empty.
 */
Connector.getCurrentTime = function() {
	if (isPlayerOffscreen()) {
		return null;
	}
	const currentTime = $(this.videoSelector).prop('currentTime');
	return this.escapeBadTimeValues(currentTime);
};

/**
 * Because player can be still present in the page, we need to detect that it's invisible
 * and don't return duration. Otherwise resulting state may not be considered empty.
 */
Connector.getDuration = function() {
	if (isPlayerOffscreen()) {
		return null;
	}
	const duration = $(this.videoSelector).prop('duration');
	return this.escapeBadTimeValues(duration);
};

Connector.getUniqueID = function() {
	return $('meta[itemprop="videoId"]').attr('content');
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

	// Remove [genre] from the beginning of the title
	text = text.replace(/^\[[^\]]+\]\s*-*\s*/i, '');

	let {artist, track} = Connector.splitArtistTrack(text);
	if (artist === null && track === null) {
		// Look for Artist "Track"
		let artistTrack = text.match(/(.+?)\s"(.+?)"/);
		if (artistTrack) {
			artist = artistTrack[1];
			track = artistTrack[2];
		}
	}
	return {artist, track};
};

Connector.filter = MetadataFilter.getYoutubeFilter();

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

function setupMutationObserver() {
	let isMusicVideoPresent = false;

	let playerObserver = new MutationObserver(function() {
		if (!isPlayerOffscreen()) {
			if (isMusicVideoPresent) {
				return;
			}

			$(Connector.videoSelector).on('timeupdate', () => {
				Connector.onStateChanged();
			});
			isMusicVideoPresent = true;
		} else {
			Connector.onStateChanged();
			isMusicVideoPresent = false;
		}
	});

	let pageElement = document.getElementById('page');
	playerObserver.observe(pageElement, {
		subtree: true,
		childList: true,
		attributes: false,
		characterData: false
	});
}

setupMutationObserver();
