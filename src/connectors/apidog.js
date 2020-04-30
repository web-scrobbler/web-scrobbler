'use strict';

Connector.playerSelector = '#headplayer';

Connector.currentTimeSelector = '#player-playedtime';

Connector.artistTrackSelector = '.headplayer-titleReal';

Connector.getDuration = () => {
	return document.getElementsByTagName('audio')[0].duration;
};

Connector.isPlaying = () => {
	return Util.hasElementClass('#headplayer-play', 'hidden');
};
