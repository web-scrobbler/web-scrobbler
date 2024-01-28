export {};

Connector.playerSelector = '.player__ft';

Connector.getTrackArt = () => {
	const src = Util.getAttrFromSelectors('.song_info__pic', 'src');
	const trackArt = src?.split('?')[0];
	return trackArt;
};

Connector.getTrack = () => {
	const text = Util.getTextFromSelectors('.song_info__name a');
	return text;
};

Connector.getArtist = () => {
	const text = Util.getTextFromSelectors('.song_info__singer a');
	return text;
};

Connector.playButtonSelector = '.btn_big_play--pause';

Connector.getUniqueID = () => {
	const text = Util.getAttrFromSelectors('.song_info__name a', 'href');
	const id = text?.split('/').at(-1);
	return id;
};

Connector.albumSelector = '.song_info__album a';

Connector.isPlaying = () => {
	const text = Util.getTextFromSelectors('.btn_big_play--pause');
	if (!text) {
		return false;
	}
	return true;
};

Connector.timeInfoSelector = '.player_music__time';
