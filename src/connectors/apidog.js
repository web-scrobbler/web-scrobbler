'use strict';

Connector.playerSelector = '#headplayer';

Connector.currentTimeSelector = '#player-playedtime';

Connector.artistTrackSelector = '.headplayer-titleReal';

Connector.getDuration = () => {
	return $('audio')[0].duration;
};

Connector.isPlaying = () => {
	return $('#headplayer-play').hasClass('hidden');
};
