'use strict';

const artistAlbumSelector = '#songdetails_artist';
const artistAlbumSeparator = ' - ';

Connector.playerSelector = '#playdeck';

Connector.getTrackInfo = () => {
	const artistAlbum = Util.getTextFromSelectors(artistAlbumSelector);
	const [artist, album] = Util.splitString(
		artistAlbum, [artistAlbumSeparator]
	);

	return { artist, album };
};

Connector.trackSelector = '#songdetails_song';

Connector.isPlaying = () => {
	const audioElement = document.querySelector('#playdeck audio');
	return audioElement !== null && audioElement.pausedi;
};

Connector.trackArtSelector = '#coverartimage img';

Connector.currentTimeSelector = '#played';

Connector.durationSelector = '#duration';
