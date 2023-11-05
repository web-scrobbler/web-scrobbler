export {};

const filter = MetadataFilter.createFilter({ track: removePlaylistNumber });

Connector.playerSelector = '#radio-left';

Connector.trackSelector = [
	'#meta-container .np-song',
	'#meta-container .song-name',
];

Connector.artistSelector = [
	'#meta-container .np-artist',
	'#meta-container .song-artist',
];

Connector.albumSelector = [
	'#meta-container .np-album',
	'#meta-container .song-album',
];

Connector.trackArtSelector = 'img.main-cover';

Connector.durationSelector = '#time-container .duration';

Connector.currentTimeSelector = '#time-container .current-time';

Connector.isTrackArtDefault = (url) => url?.includes('no-cover');

Connector.isPlaying = () => Util.hasElementClass('#play-pause', 'playing');

Connector.applyFilter(filter);

function removePlaylistNumber(text: string) {
	return text.replace(/^\d+\.\s/, '');
}
