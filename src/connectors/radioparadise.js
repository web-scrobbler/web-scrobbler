'use strict';

Connector.playerSelector = '.content-wrapper';

Connector.albumSelector = '.now_playing_list.ng-star-inserted:not(.dim) .title .album';

Connector.getArtistTrack = () => {
	const text = document.title;
	return Util.splitArtistTrack(text);
};

Connector.isPlaying = () => Util.hasElementClass('#play-button', 'active');

Connector.trackArtSelector = '.now_playing_list.ng-star-inserted:not(.dim) img';
