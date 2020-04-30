'use strict';

// FIXME Remove this filter once metadata-filter@0.4.0 is published
const filter = new MetadataFilter({ track: removeSuffix });

Connector.playerSelector = '.ui.controls';

Connector.currentTimeSelector = '.item.start.time';

Connector.trackArtSelector = '.ui.item.active img';

Connector.artistTrackSelector = '.current .title';

Connector.isPlaying = () => Util.hasElementClass('.item.play.button', 'active');

Connector.getUniqueID = () => {
	const videoUrl = Util.getAttrFromSelectors('#player', 'src');
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.applyFilter(MetadataFilter.getYoutubeFilter().extend(filter));

function removeSuffix(text) {
	return text.replace(/ \[.*/, '');
}
