export {};

const filter = MetadataFilter.createFilter({ track: removeOriginalMix });
const playerBar = '#bp-player';

Connector.playerSelector = playerBar;

Connector.artistSelector = `${playerBar} a[href^="/artist/"]`;

Connector.trackSelector = `${playerBar} a[href^="/track/"] [class*="Player-style__TrackName"]`;

Connector.playButtonSelector = `${playerBar} [data-testid="player-control-play_track"]`;

Connector.currentTimeSelector = `${playerBar} [data-testid="player-clock-played_time"]`;

Connector.durationSelector = `${playerBar} ${Connector.currentTimeSelector}+*`;

Connector.trackArtSelector = `${playerBar} img.current`;

Connector.getUniqueID = () => {
	const trackUrl = Util.getAttrFromSelectors(Connector.trackSelector, 'href');
	return trackUrl?.split('/').at(-1);
};

Connector.applyFilter(filter);

function removeOriginalMix(track: string) {
	const remixedBy = Util.getTextFromSelectors(
		`${playerBar} a[href^="/track/"] [class*="Player-style__MixName"]`,
	);
	if (remixedBy === 'Original Mix') {
		return track;
	}

	return `${track} (${remixedBy})`;
}
