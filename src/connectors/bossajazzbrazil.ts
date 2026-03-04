export {};

Connector.playerSelector = ['.cc_recenttracks_list'];

Connector.trackArtSelector = '.cctrack:has(.ccnowplaying) .cccover img';

Connector.trackSelector = '.cctrack:has(.ccnowplaying) .cctitle';

Connector.artistSelector = '.cctrack:has(.ccnowplaying) .ccartist';

Connector.albumSelector = '.cctrack:has(.ccnowplaying) .ccalbum';

Util.bindListeners(['audio'], ['playing', 'pause'], Connector.onStateChanged);

Connector.isPlaying = () => {
	const audioElement = document.querySelector('audio');
	return !audioElement?.paused;
};
