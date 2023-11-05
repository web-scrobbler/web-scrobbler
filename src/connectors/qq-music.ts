export {};

Connector.playerSelector = '#opbanner';

Connector.artistSelector = '#singer_name a';

Connector.trackSelector = '#song_name a';

Connector.getUniqueID = () => {
	const text = Util.getAttrFromSelectors('#song_name a', 'href');
	return text?.split('/').at(-1)?.split('.html')[0];
};

Connector.albumSelector = '#album_name a';

Connector.isPlaying = () =>
	Util.hasElementClass('#btnplay', 'btn_big_play--pause');

Connector.timeInfoSelector = '#time_show';

Connector.trackArtSelector = '#song_pic';
