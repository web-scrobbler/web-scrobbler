'use strict';

Connector.playerSelector = 'body';

Connector.artistTrackSelector = '.nav-wrapper span.title';

Connector.playButtonSelector = '.resume';

Connector.getUniqueID = () => {
	let videoUrl = $('.sourceOpen').attr('href');
	return Util.getYoutubeVideoIdFromUrl(videoUrl);
};

Connector.filter = MetadataFilter.getYoutubeFilter().append({
	track: (text) => text.replace(/ \[.*/, '')
});
