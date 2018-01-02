'use strict';

const artistTrackRe = /(.+?)《(.+?)》/;

function setupCoverPlayer() {
	Connector.getArtistTrack = () => {
		let text = $('.video_title ._base_title').attr('title');
		return extractArtistTrack(text);
	};
}

function setupPagePlayer() {
	Connector.getArtistTrack = () => {
		let text = $('.video_title').attr('title');
		return extractArtistTrack(text);
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

// Example: 周华健《朋友》(KTV版)
function extractArtistTrack(artistTrackStr) {
	let match = artistTrackStr.match(artistTrackRe);
	if (match) {
		return { artist: match[1], track: match[2] };
	}

	return Util.makeEmptyArtistTrack();
}

function setupConnector() {
	// Set up letiables common to all player types
	Connector.playerSelector = '.container_player';

	// Set up connector depending on player type
	if (isCoverPlayer()) {
		setupCoverPlayer();
	}	else if (isPagePlayer()) {
		setupPagePlayer();
	}	else {
		console.warn('QQ Video connector: unknown player');
	}
}

setupConnector();
