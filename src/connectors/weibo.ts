export {};

Connector.playerSelector = '.PCD_mplayer';

Connector.trackSelector = '.name_bar';

Connector.artistSelector = '.author_bar';

Connector.pauseButtonSelector = '.ico_pause';

Connector.remainingTimeSelector = '.time_count';

Connector.trackArtSelector = '.music_pic img';

Connector.getUniqueID = () => {
	const text = Util.getAttrFromSelectors('.current', 'objectid');
	return text && text.split('_').at(-1);
};
