'use strict';

const version = $('body').hasClass('navia') ? 'new' : 'legacy';
switch (version) {
	case 'new':
		bindNew();
		break;

	case 'legacy':
		bindLegacy();
		break;

	default:
		Util.debugLog('Unable to match version. Please report at https://github.com/web-scrobbler/web-scrobbler/issues', 'warn');
		break;
}

function bindCommon() {
	Connector.currentTimeSelector = '.jw-text-elapsed';

	Connector.durationSelector = '.jw-text-duration';

	Connector.isPlaying = () => {
		return !$('video')[0].paused;
	};
}

function bindNew() {
	bindCommon();

	Connector.playerSelector = '#theatre-ia';

	Connector.trackArtSelector = '#theatre-ia center > img';

	Connector.getArtistTrack = () => {
		let track = $('.jwrowV2.playing .ttl').text();
		const artist = $('.info-top .metadata-definition > dd').first().text();

		const trackParts = track.split('-').map((item) => {
			return item.trim();
		});
		if (trackParts.length === 3 && trackParts[0] === artist) {
			track = trackParts[2];
		}

		return { artist, track };
	};

	Connector.getAlbum = () => {
		return $('.thats-left > h1 [itemprop=name]').text();
	};
}

function bindLegacy() {
	bindCommon();

	Connector.playerSelector = '#avplaydiv';

	Connector.trackArtSelector = '#col1 > div:nth-child(1) > div:nth-child(2) > img';

	Connector.getAlbum = () => {
		let album = $('.x-archive-meta-title').text();

		// Remove artist from album
		const parts = album.split('-');
		if (parts.length > 0 && parts[0].trim() === Connector.getArtist()) {
			album = album.substr(album.indexOf('-') + 1);
		}

		return album;
	};

	Connector.getArtist = () => {
		return $('span.key:contains("Artist/Composer:"), span.key:contains("Band/Artist:")').next().text();
	};

	Connector.getTrack = () => {
		// Get title directly from player
		let title = $('.playing > .ttl').text();

		// Some titles are stored as artist - track # - title so strip out non-title elements
		const parts = title.split('-');
		if (parts.length === 3 && parts[0].trim() === Connector.getArtist()) {
			title = parts[2];
		}

		return title;
	};
}
