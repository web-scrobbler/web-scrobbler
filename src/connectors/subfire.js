'use strict';

Connector.playerSelector = '#player-cover';

Connector.getArtist = () => document.querySelector('input#artist').value;

Connector.getTrack = () => document.querySelector('input#title').value;

Connector.getAlbum = () => document.querySelector('input#album').value;

Connector.playButtonSelector = '#player-cover #player-btn-playpause.ui-icon-play';

Connector.trackArtSelector = '#player-cover img#coverart';

// original selectors are `#duration-label .currentTime` and `#duration-label .endTime`
// but these values are pretty unstable during loading time
Connector.getCurrentTime = () => document.querySelector('#player').currentTime;

Connector.getDuration = () => document.querySelector('#player').duration;

Connector.getUniqueID = () => {
	const src = document.querySelector('#player').src;
	return src && src.match(/id=([^&]*)/i)[1] || null;
};

Connector.isScrobblingAllowed = () => Util.isElementVisible(Connector.playerSelector);
