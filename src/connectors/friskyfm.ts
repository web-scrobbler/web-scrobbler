export {};
Connector.playerSelector = '#app';
Connector.trackSelector = '[class*=music-player_metaInner_] .title';
Connector.artistSelector = '[class*=music-player_metaInner_] .artist';
Connector.trackArtSelector = 'img[class*=_base-resource-image_image_]';
Connector.isPlaying = () =>
	Util.getAttrFromSelectors(
		'[class*=music-player_play_] > svg > use',
		'xlink:href',
	) === '#icon-pause';
