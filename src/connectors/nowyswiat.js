'use strict';

Connector.playerSelector = '.qtmplayer__controllayer';

Connector.trackSelector = '.qtmplayer__title .marquee';

Connector.artistSelector = '.qtmplayer__artist .marquee';

Connector.trackArtSelector = '.qtmplayer__cover > img';

Connector.isPlaying = () => {
	return Util.getTextFromSelectors('#qtmplayerPlay > .material-icons') === 'pause';
};

Connector.isStateChangeAllowed = () => {
	const artist = Util.getTextFromSelectors('.qtmplayer__artist');
	return artist !== 'Radio Nowy Świat';
};

Connector.onReady = Connector.onStateChanged;
