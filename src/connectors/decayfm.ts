export {};

Connector.playerSelector = '#qtmplayer';

Connector.artistSelector = '.qtmplayer__songdata .qtmplayer__artist .marquee';

Connector.trackSelector = '.qtmplayer__songdata .qtmplayer__title .marquee';

Connector.trackArtSelector = '.qtmplayer__covercontainer img';

Connector.isPlaying = () =>
	Util.getTextFromSelectors('#qtmplayerPlay .material-icons') === 'pause';

Connector.scrobblingDisallowedReason = () => {
	const artist = Connector.getArtist();
	if (!artist) {
		return 'Other';
	}
	if (artist.match(/^DKFM|^ID\/PSA|^Advert:/)) {
		return 'IsAd';
	}
	return null;
};
