export {};

Connector.playerSelector = '.player-control-bar';

Connector.artistSelector = '.js-current-track-artist';
Connector.trackSelector = '.js-current-track-title';

Connector.currentTimeSelector = '.js-current-time';
Connector.durationSelector = '.js-current-track-duration';

Connector.playButtonSelector = '.js-play-track';

// artist element leads with " - ", remove that.
function filterArtist(text: string) {
	return text.trim().slice(1).trim();
}
Connector.applyFilter(MetadataFilter.createFilter({ artist: filterArtist }));
