'use strict';

Connector.playerSelector = '#app > div';

Connector.artistTrackSelector =
	'div.w-full > div:nth-child(1) > div.font-bold.mt-2.text-2xl.break-words';

Connector.getArtistTrack = () => {
	const text = Util.getTextFromSelectors(Connector.artistTrackSelector);
	return Util.processYtVideoTitle(text);
};

Connector.getCurrentTime = () =>
	document.querySelector('.shaka-video').currentTime;

Connector.getDuration = () => document.querySelector('.shaka-video').duration;

Connector.getUniqueID = () => {
	const videoUrl = Util.getAttrFromSelectors('[aria-current=page]', 'href');
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.isPlaying = () =>
	document.querySelector('.shaka-small-play-button').innerText === 'pause';

Connector.applyFilter(MetadataFilter.getYoutubeFilter());
