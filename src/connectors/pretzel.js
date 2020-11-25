'use strict';

setupConnector();

function setupConnector() {
	setupCommonProperties();

	if (isMiniPlayer()) {
		Util.debugLog('Setup properties for mini player');

		setupPropertiesForMiniPlayer();
	} else {
		Util.debugLog('Setup properties for full player');

		setupPropertiesForFullPlayer();
	}
}

function isMiniPlayer() {
	return location.hostname === 'app.pretzel.rocks';
}

function setupCommonProperties() {
	const filter = MetadataFilter.createFilter({
		track: MetadataFilter.fixTrackSuffix,
		album: MetadataFilter.fixTrackSuffix,
	});

	Connector.applyFilter(filter);
}

// https://app.pretzel.rocks
function setupPropertiesForMiniPlayer() {
	const artistSelector = '.kkKxss p:nth-child(2) .CIWgt';

	Connector.playerSelector = '.eLgAlM';

	Connector.trackSelector = '.bPhEWg';

	Connector.albumSelector = '.kkKxss p:nth-child(3) .CIWgt';

	Connector.pauseButtonSelector = '.pretzel-icon-pause';

	Connector.trackArtSelector = '.rgUOX';

	Connector.currentTimeSelector = '.foNsgO p:nth-child(1)';

	Connector.durationSelector = '.foNsgO p:nth-child(2)';

	Connector.getArtist = () => getArtistsFromElement(artistSelector);
}

// https://play.pretzel.rocks/
function setupPropertiesForFullPlayer() {
	const artistSelector = '.kzpiRD p:nth-child(2) a';

	Connector.playerSelector = '.hOOKvw';

	Connector.trackSelector = '.oKpSL';

	Connector.albumSelector = '.kzpiRD p:nth-child(3) a';

	Connector.playButtonSelector = '.pretzel-icon-player_play';

	Connector.trackArtSelector = '.rwQJb img';

	Connector.currentTimeSelector = '.hcriLb p:nth-child(1)';

	Connector.durationSelector = '.hcriLb p:nth-child(3)';

	Connector.getArtist = () => getArtistsFromElement(artistSelector);
}

function getArtistsFromElement(selector) {
	const artistElements = document.querySelectorAll(selector);
	return Util.joinArtists(Array.from(artistElements));
}
