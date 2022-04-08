'use strict';

Connector.playerSelector = '.duration-1000';

Connector.trackSelector = '.text-current > h2';

Connector.getTrackInfo = () => {
	const artistAlbumText = Util.getTextFromSelectors('.text-current > p');

	const lastSeparatorIndex = artistAlbumText.lastIndexOf(' - ');

	const artistAlbumInfo = {
		album: artistAlbumText.slice(0, lastSeparatorIndex),
		artist: artistAlbumText.slice(lastSeparatorIndex + 3),
	};

	return artistAlbumInfo;
};

Connector.trackArtSelector = '.duration-1000 .max-w-112 > img';

Connector.playButtonSelector = '.duration-1000 button[aria-label=Play]';

Connector.durationSelector = '.duration-1000 .rounded-md.border-gray-400 button > span > span:nth-of-type(3) > span';
