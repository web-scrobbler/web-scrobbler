export {};

Connector.playerSelector = '.player-meta';

Connector.artistSelector = '.player-meta__artist';

Connector.trackSelector = '.player-meta__title';

Connector.playButtonSelector = '.player-meta__icon--play';

Connector.scrobblingDisallowedReason = () => {
	const artist = Connector.getArtist();
	if (artist && artist.match(/gds\.fm/)) {
		return 'FilteredTag';
	}

	return null;
};
