'use strict';

const playerBar = '#nowPlaying';
const playButtonSelector = `${playerBar} [class*="playbackToggle"]`;
const fullTrackSelector = `${playerBar} [class^="mediaInformation"] span:nth-child(1) a`;
const shortTrackSelector = `${playerBar} [class^="infoTableWrapper"] > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)`;

let useShortTrackNames = false;

readConnectorOptions();

Connector.playerSelector = playerBar;

Connector.playButtonSelector = `${playerBar} [class*="playbackToggle"]`;

Connector.isPlaying = () => {
	return Util.getAttrFromSelectors(playButtonSelector, 'data-test') === 'pause';
};

Connector.getTrack = () => Util.getTextFromSelectors(useShortTrackNames ? shortTrackSelector : fullTrackSelector);

Connector.getUniqueID = () => {
	const trackUrl = Util.getAttrFromSelectors(fullTrackSelector, 'href');
	return trackUrl && trackUrl.split('/').pop();
};

Connector.artistSelector = `${playerBar} [class^="mediaArtists"]`;

Connector.albumSelector = `${playerBar} [class^="infoTable--"] a[href^="/album/"]`;

Connector.trackArtSelector = `${playerBar} [class^="mediaImageryTrack"] img`;

Connector.currentTimeSelector = `${playerBar} [data-test="duration"] [class^="currentTime"]`;

Connector.durationSelector = `${playerBar} [data-test="duration"] [class^="duration"]`;

Connector.applyFilter(MetadataFilter.getTidalFilter());

async function readConnectorOptions() {
	useShortTrackNames = await Util.getOption('Tidal', 'useShortTrackNames');
}
