export {};

Connector.playerSelector = '#radio';

Connector.artistSelector = '.playlist__artist-name';

Connector.trackSelector = '.playlist__song-name';

Connector.trackArtSelector = '.playlist__img';

Connector.pauseButtonSelector = '.btn-play #radio-button.stop';

Connector.playButtonSelector = '.btn-play #radio-button.play';

Connector.getTrack = () => {
	// Fix specifically for this radio https://ecouterradioenligne.com/skyrock-la-nocturne/
	// which returns incorrect track suffixes, such as `Track Name §12345` for `Track Name`
	return Util.getTextFromSelectors(Connector.trackSelector)?.replace(
		/ §\d+$/, // https://regex101.com/r/MIJclS/1
		'',
	);
};
