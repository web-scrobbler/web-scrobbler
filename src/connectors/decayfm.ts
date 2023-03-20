'use strict';

Connector.playerSelector = '#qtmplayer';

Connector.artistSelector = '.qtmplayer__songdata .qtmplayer__artist .marquee';

Connector.trackSelector = '.qtmplayer__songdata .qtmplayer__title .marquee';

Connector.trackArtSelector = '.qtmplayer__covercontainer img';

Connector.isPlaying = () => Util.getTextFromSelectors('#qtmplayerPlay .material-icons') === 'pause';

Connector.isScrobblingAllowed = () => {
	return Connector.getArtist() && !Connector.getArtist().match(/^DKFM|^ID\/PSA|^Advert:/);
};
