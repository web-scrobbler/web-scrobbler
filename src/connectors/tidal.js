'use strict';

let useShortTrackNames = false;

readConnectorOptions();

Connector.playerSelector = '#nowPlaying';

Connector.playButtonSelector = `${Connector.playerSelector} [class*="playbackToggle"]`;

Connector.isScrobblingAllowed = () => !!$(Connector.playButtonSelector);

Connector.isPlaying = () => $(Connector.playButtonSelector).attr('data-test') === 'pause';

const fullTrackSelector = `${Connector.playerSelector} [class^="mediaInformation"] span:nth-child(1) a`;
const shortTrackSelector = `${Connector.playerSelector} [class^="infoTableWrapper"] > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)`;

Connector.getTrack = () => Util.getTextFromSelectors(useShortTrackNames ? shortTrackSelector : fullTrackSelector);

Connector.getUniqueID = () => {
	const trackUrl = $(fullTrackSelector).attr('href');
	if (trackUrl) {
		return trackUrl.split('/').pop();
	}
	return null;
};

Connector.artistSelector = `${Connector.playerSelector} [class^="mediaArtists"]`;

Connector.albumSelector = `${Connector.playerSelector} [class^="infoTable--"] a[href^="/album/"]`;

Connector.trackArtSelector = `${Connector.playerSelector} [class^="mediaImageryTrack"] img`;

Connector.currentTimeSelector = `${Connector.playerSelector} [data-test="duration"] [class^="currentTime"]`;

Connector.durationSelector = `${Connector.playerSelector} [data-test="duration"] [class^="duration"]`;

Connector.applyFilter(MetadataFilter.getTidalFilter());

async function readConnectorOptions() {
	useShortTrackNames = await Util.getOption('Tidal', 'useShortTrackNames');
}
