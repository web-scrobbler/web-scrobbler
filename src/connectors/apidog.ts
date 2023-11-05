export {};

Connector.playerSelector = '#headplayer';

Connector.currentTimeSelector = '#player-playedtime';

Connector.artistTrackSelector = '.headplayer-titleReal';

Connector.getDuration = () => {
	return document.querySelector('audio')?.duration;
};

Connector.isPlaying = () => {
	return Util.hasElementClass('#headplayer-play', 'hidden');
};
