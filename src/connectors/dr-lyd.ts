export {};

Connector.playerSelector = '[class^=Player_PlayerBar_bar]';

Connector.playButtonSelector = 'button[title="Afspil"]';

Connector.artistSelector = '[class^=MusicArtistRole_role]';

const filter = MetadataFilter.createFilter({
	track: cleanupTrack,
});

Connector.trackSelector = '[class^=MusicTrackLine_title]';
Connector.applyFilter(filter);

function cleanupTrack(text: string) {
	return text.replace('“', '').replace('”', '');
}
