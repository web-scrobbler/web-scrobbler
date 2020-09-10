'use strict';

Connector.getTimeInfo = () => {
	const { currentTime, duration } = document.querySelector('#aPlayer');
	return { currentTime, duration };
};

Connector.playerSelector = '.m-upload-list';

if (window.location.href.includes('/artist/')) {
	setupArtistPlayer();
} else {
	setupSongPlayer();
}

function setupArtistPlayer() {

	Connector.getTrackInfo = () => {
		const parentLi = document.querySelector('.pause[style*="display: block"]').closest('li');

		const songInfo = {
			artist: parentLi.querySelector('.artist_name').innerText,
			track: parentLi.querySelector('.player').dataset.srcname,
			trackArt: parentLi.querySelector('img').src,
		};

		return songInfo;
	};

	Connector.pauseButtonSelector = '.pause[style*="display: block;"]';
}

function setupSongPlayer() {

	Connector.trackArtSelector = '.img-album img';

	Connector.artistSelector = '.artist_name a';

	Connector.trackSelector = '#js-product-name-0 p';

	Connector.pauseButtonSelector = '.pause';
}
