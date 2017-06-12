'use strict';

/* global Connector */

Connector.playerSelector = '#Wrapper';

Connector.artistSelector = '#track-artist';

Connector.trackSelector = '#track-title';

Connector.albumSelector = '#track-album';

Connector.trackArtSelector = '#covercontainer img';

Connector.isPlaying = function () {
	return $('#controls-play').hasClass('play');
};
