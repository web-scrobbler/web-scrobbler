export {};

Connector.playerSelector = '#app > div';

Connector.artistTrackSelector =
	'div.w-full > div:nth-child(1) > div.font-bold.mt-2.text-2xl.break-words';

Connector.getArtistTrack = () => {
	const text = Util.getTextFromSelectors(Connector.artistTrackSelector);
	return Util.processYtVideoTitle(text);
};

Connector.getCurrentTime = () => {
	const videoEl = document.querySelector('.shaka-video') as HTMLVideoElement;
	return videoEl ? videoEl.currentTime : null;
};

Connector.getDuration = () => {
	const videoEl = document.querySelector('.shaka-video') as HTMLVideoElement;
	return videoEl ? videoEl.duration : null;
};

Connector.getUniqueID = () => {
	const videoUrl = Util.getAttrFromSelectors('[aria-current=page]', 'href');
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.isPlaying = () =>
	(document.querySelector('.shaka-small-play-button') as HTMLButtonElement)
		?.innerText === 'pause';

Connector.applyFilter(MetadataFilter.createYouTubeFilter());
