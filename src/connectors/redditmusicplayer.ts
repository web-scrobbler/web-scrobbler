export {};

Connector.playerSelector = '.ui.controls';

Connector.currentTimeSelector = '.item.start.time';

Connector.trackArtSelector = '.ui.item.active img';

Connector.getArtistTrack = () => {
	const text = Util.getTextFromSelectors('.current .title')?.replace(
		/ \[.*/,
		''
	);
	return Util.splitArtistTrack(text);
};

Connector.isPlaying = () => Util.hasElementClass('.item.play.button', 'active');

Connector.getUniqueID = () => {
	const videoUrl = Util.getAttrFromSelectors('#player', 'src');
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.applyFilter(MetadataFilter.createYouTubeFilter());
