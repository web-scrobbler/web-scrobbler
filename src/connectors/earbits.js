'use strict';

Connector.playerSelector = '#player';

Connector.artistSelector = '#artist_name';

Connector.trackSelector = '.track_name';

Connector.albumSelector = '.album_name';

Connector.currentTimeSelector = '#time_current';

Connector.durationSelector = '#time_end';

Connector.trackArtSelector = '.album_cover';

Connector.isPlaying = () => {
	let playButtonImgFilename = $('#play-pause img').attr('src');
	return playButtonImgFilename.includes('pause');
};
