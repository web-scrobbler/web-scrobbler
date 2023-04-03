export {};

Connector.playerSelector = 'player';

Connector.artistSelector =
	'cover-with-info.current.cover artist-names div.value';

Connector.trackSelector =
	'cover-with-info.current.cover div.title-content > span.title';

Connector.albumSelector = 'cover-with-info.current.cover div.album';

Connector.trackArtSelector = 'cover-with-info.current.cover div.background';

Connector.currentTimeSelector = 'time-progress div.time.duration';

Connector.durationSelector = 'time-progress div.track.duration';

Connector.isPlaying = () => {
	return Util.hasElementClass(
		'time-progress div.time.duration',
		'ng-star-inserted'
	);
};
