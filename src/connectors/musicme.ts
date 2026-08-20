export {};

const player = '#audio-player';
const filter = MetadataFilter.createFilter({
	track: [
		MetadataFilter.removeRemastered,
		MetadataFilter.removeVersion,
		MetadataFilter.removeLive,
	],
});

Connector.playerSelector = player;

Connector.artistSelector = `${player} .meta-main > a:first-of-type`;

Connector.trackSelector = `${player} .meta-sub`;

Connector.trackArtSelector = `${player} img.cover`;

Connector.currentTimeSelector = `${player} .timing-elapsed`;

Connector.durationSelector = `${player} .timing-total`;

Connector.playButtonSelector = `${player} .control-play .glyphicons-play`;

Connector.applyFilter(filter);
