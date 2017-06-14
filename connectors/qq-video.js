'use strict';

/* global Connector */


function setupCoverPlayer() {
	Connector.getArtistTrack = function() {
		let text = $('.video_title ._base_title').attr('title');
		return this.splitArtistTrack(text);
	};
}

function setupPagePlayer() {
	Connector.getArtistTrack = function() {
		let text = $('.video_title').attr('title');
		return this.splitArtistTrack(text);
	};
}

// Example: https://v.qq.com/x/cover/zz4s3deuelkwbdk/t0023et2neq.html
function isCoverPlayer() {
	return window.location.href.includes('x/cover/');
}

// Example: https://v.qq.com/x/page/y0142cniol3.html
function isPagePlayer() {
	return window.location.href.includes('x/page/');
}

function setupConnector() {
	// Set up variables common to all player types
	Connector.playerSelector = '.container_player';

	Connector.splitArtistTrack = function(str) {
		// Example: 周华健《朋友》(KTV版)
		let artist = '';
		let track = '';
		let artistMatch = str.split('《');
		let trackMatch = str.match(/《(.*?)》/);

		if (artistMatch.length > 0) {
			artist = artistMatch[0];
		}

		if (trackMatch.length > 1) {
			track = trackMatch[1];
		}

		return { artist, track };
	};

	// Set up connector depending on player type
	if (isCoverPlayer()) {
		setupCoverPlayer();
	}
	else if (isPagePlayer()) {
		setupPagePlayer();
	}
	else {
		console.warn('QQ Video connector: unknown player');
	}
}

setupConnector();
