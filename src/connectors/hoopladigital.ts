export {};

Connector.playerSelector = '#app'; // .duration-700 player wrapper is destroyed when album ends

Connector.pauseButtonSelector = 'button[aria-label=Pause]';

Connector.trackSelector = '.text-current > p:first-of-type';

Connector.artistSelector = '.text-current > p:nth-of-type(2)';

Connector.albumSelector =
	'.duration-700.z-100 .box-border button.text-hoopla-blue-800 > a:last-of-type'; // only available in expanded player

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(
		'.duration-700.z-100 .grid > div:first-of-type > img'
	);

	if (trackArtUrl) {
		return trackArtUrl.replace(/(?<=_)\d{3}(?=\.jpeg)/g, '916'); // larger image filename
	}

	return null;
};

Connector.durationSelector =
	'.duration-700.z-100 .grid > div:nth-of-type(2) > div.justify-between > span:last-of-type > span';

Connector.currentTimeSelector =
	'.duration-700.z-100 .grid > div:nth-of-type(2) > div.justify-between > span:first-of-type > span';
