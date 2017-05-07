'use strict';

/* global Connector, MetadataFilter, Util */

Connector.playerSelector = 'body';

Connector.artistTrackSelector = '.nav-wrapper span.title';

Connector.playButtonSelector = '.resume';

Connector.getUniqueID = () => {
	let videoUrl = $('.sourceOpen').attr('href');
	return Util.getYoutubeVideoIdFromUrl(videoUrl);
};

Connector.filter = new MetadataFilter({
	track: (text) => text.replace(/ \[.*/, '')
});
