'use strict';

Connector.playerSelector = '#headplayer';

Connector.currentTimeSelector = '#player-playedtime';

Connector.artistTrackSelector = '.headplayer-titleReal';

Connector.getArtistTrack = () => {
	let text = $(Connector.artistTrackSelector).first().text();
	return Util.splitArtistTrack(text);
};

Connector.getDuration = () => {
	return $('audio')[0].duration;
};

Connector.isPlaying = () => {
	return $('#headplayer-play').hasClass('hidden');
};
