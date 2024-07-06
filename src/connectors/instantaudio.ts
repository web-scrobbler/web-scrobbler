export {};

Connector.playerSelector = '#radio';

Connector.artistSelector = '.playlist__artist-name';

Connector.trackSelector = '.playlist__song-name';

Connector.trackArtSelector = '.playlist__img';

Connector.pauseButtonSelector = '.btn-play #radio-button.stop';

Connector.playButtonSelector = '.btn-play #radio-button.play';

Connector.getTrack = () => {
	const currentTrack = Util.getTextFromSelectors(Connector.trackSelector);
	return currentTrack ? stripSectionSignNumberSuffix(currentTrack) : null;
};

// Fix specifically for https://ecouterradioenligne.com/skyrock-la-nocturne/
// which returns incorrect track suffixes, such as `Track Name §12345` for `Track Name`
function stripSectionSignNumberSuffix(trackName: string) {
	// https://regex101.com/r/MIJclS/1
	return trackName.replace(/ §\d+$/, '');
}
