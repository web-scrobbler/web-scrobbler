'use strict';

Connector.playerSelector = '.duration-1000';

Connector.trackSelector = '.text-current > h2';

Connector.getTrackInfo = () => {
	const artistAlbumText = Util.getTextFromSelectors('.text-current > p');

	const lastSeparator = artistAlbumText.lastIndexOf(' - ');

	const artistAlbumInfo = {
		album: artistAlbumText.slice(0, lastSeparator),
		artist: artistAlbumText.slice(lastSeparator + 3),
	};

	return artistAlbumInfo;
};

Connector.trackArtSelector = '.duration-1000 .max-w-112 > img';

Connector.playButtonSelector = '.duration-1000 button[aria-label=Play]';

Connector.durationSelector = '.duration-1000 .rounded-md.border-gray-400 button > span > span:nth-of-type(3) > span';
