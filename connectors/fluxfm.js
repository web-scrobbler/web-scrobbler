'use strict';

Connector.playerSelector = '#Wrapper';

Connector.artistSelector = '#track-artist';

Connector.trackSelector = '#track-title';

Connector.albumSelector = '#track-album';

Connector.trackArtSelector = '#covercontainer img';

Connector.isPlaying = () => {
	return $('#controls-play').hasClass('play');
};

Connector.onReady = Connector.onStateChanged;
