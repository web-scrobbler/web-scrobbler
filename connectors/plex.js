'use strict';

setupConnector();

/**
 * Setup properties.
 */
function setupConnector() {
	if (isRemoteUI()) {
		setupRemoteUI();
	} else {
		setupLocalUI();
	}
}

/**
 * Check if remote UI is used.
 * @return {Boolean} Check result
 */
function isRemoteUI() {
	return location.hostname === 'app.plex.tv';
}

/**
 * Setup properties for UI available on http://127.0.x.x:xxxxx.
 */
function setupLocalUI() {
	Connector.playerSelector = '#plex';

	Connector.artistSelector = '.grandparent-title';

	Connector.trackSelector = '.title-container .item-title';

	Connector.currentTimeSelector = '.player-position';

	Connector.durationSelector = '.player-duration';

	Connector.isPlaying = () => $('.player .play-btn').hasClass('hidden');

	Connector.getTrackArt = () => $('.player .media-poster').data('imageUrl');

	Connector.getAlbum = () => $('.player .media-poster').data('parentTitle');
}

/**
 * Setup properties for UI available on https://app.plex.tv/web/app.
 */
function setupRemoteUI() {
	Connector.playerSelector = '[class^=MiniPlayerContainer-miniPlayer]';

	Connector.artistSelector = `${Connector.playerSelector} [class*=MetadataPosterTitle-title] > a:nth-child(1)`;

	Connector.trackSelector = `${Connector.playerSelector} [class*=titlesContainer] > a`;

	Connector.albumSelector = `${Connector.playerSelector} [class*=MetadataPosterTitle-title] > a:nth-child(3)`;

	Connector.playButtonSelector = `${Connector.playerSelector} [class^=plex-icon-player-play]`;

	Connector.timeInfoSelector = `${Connector.playerSelector} [class^=DurationRemaining-container]`;
}
