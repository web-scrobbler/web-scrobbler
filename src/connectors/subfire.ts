export {};

Connector.playerSelector = '#player-cover';

Connector.getArtist = () =>
	(document.querySelector('input#artist') as HTMLInputElement).value;

Connector.getTrack = () =>
	(document.querySelector('input#title') as HTMLInputElement).value;

Connector.getAlbum = () =>
	(document.querySelector('input#album') as HTMLInputElement).value;

Connector.playButtonSelector =
	'#player-cover #player-btn-playpause.ui-icon-play';

Connector.trackArtSelector = '#player-cover img#coverart';

// original selectors are `#duration-label .currentTime` and `#duration-label .endTime`
// but these values are pretty unstable during loading time
Connector.getCurrentTime = () =>
	(document.querySelector('#player') as HTMLAudioElement).currentTime;

Connector.getDuration = () =>
	(document.querySelector('#player') as HTMLAudioElement).duration;

Connector.getUniqueID = () => {
	const src = (document.querySelector('#player') as HTMLAudioElement).src;
	return (src && src.match(/id=([^&]*)/i)?.[1]) || null;
};

Connector.isScrobblingAllowed = () =>
	Util.isElementVisible(Connector.playerSelector);
