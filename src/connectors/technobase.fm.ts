export {};

const filter = MetadataFilter.createFilter({
	track: replaceWith,
});
Connector.applyFilter(filter);

Connector.isPlaying = () =>
	Util.hasElementClass('.streamplayer-button', 'playing');

Connector.playerSelector = '.stream-wrapper';
Connector.artistSelector = '.streamplayer-artist .streamplayer-link';
Connector.trackSelector = '.streamplayer-title .streamplayer-link';

function replaceWith(text: string) {
	// some DJs choose to use "Artist A with Artist B"
	// instead of "Artist A & Artist B"
	return text.replace(/\swith\s/, ' & ');
}
