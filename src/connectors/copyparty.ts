export {};

Connector.playerSelector = '#np_inf';
Connector.pauseButtonSelector = '#np_inf.playing';

Connector.trackArtSelector = '#np_img';
Connector.albumArtistSelector = '#np_circle';
Connector.albumSelector = '#np_album';
Connector.artistSelector = '#np_artist';
Connector.trackSelector = '#np_title';

Connector.currentTimeSelector = '#np_pos';
Connector.durationSelector = '#np_dur';

Connector.getUniqueID = () => {
	return Util.getTextFromSelectors('#np_url');
};
