'use strict';

Connector.playerSelector = '#app > div';

Connector.artistTrackSelector = 'div.w-full > div:nth-child(1) > div.font-bold.mt-2.text-2xl.break-words';

Connector.getArtistTrack = () => {
	const text = $(Connector.artistTrackSelector).text();
	return Util.processYtVideoTitle(text);
};

Connector.getCurrentTime = () => $('.shaka-video').prop('currentTime');

Connector.getDuration = () => $('.shaka-video').prop('duration');

Connector.getUniqueID = () => {
	const videoUrl = $('[aria-current=page]').attr('href');
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.isPlaying = () => $('.shaka-small-play-button').text() === 'pause';

Connector.applyFilter(MetadataFilter.getYoutubeFilter());
