'use strict';

Connector.playerSelector = '.sxm-player-controls';

Connector.artistSelector = '.sxm-player-controls .artist-name';

Connector.trackSelector = '.sxm-player-controls .track-name';

Connector.isPlaying = () => {
	return $('.sxm-player-controls .play-pause-btn').attr('title') === 'Pause';
};

Connector.trackArtSelector = '.album-image-cell img';

Connector.isScrobblingAllowed = () => {
	const artist = Connector.getArtist().toLowerCase();
	return !artist.includes('siriusxmu');
};
