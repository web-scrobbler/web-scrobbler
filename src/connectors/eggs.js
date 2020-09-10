'use strict';

Connector.getDuration = () => document.querySelector('#aPlayer').duration;

Connector.getCurrentTime = () => document.querySelector('#aPlayer').currentTime;

Connector.playerSelector = '.m-upload-list';

if (window.location.href.includes('/artist/')) {
	setupArtistPlayer();
} else {
	setupSongPlayer();
}

function setupArtistPlayer() {

	Connector.getTrackArt = () => document.querySelector('.pause[style*="display: block;"]').closest('.img-album').querySelector('img').src;

	Connector.getArtist = () => document.querySelector('.pause[style*="display: block;"]').closest('li').querySelector('.artist_name').innerText;

	Connector.getTrack = () => document.querySelector('.pause[style*="display: block;"]').closest('.player').dataset.srcname;

	Connector.pauseButtonSelector = '.pause[style*="display: block;"]';
}

function setupSongPlayer() {

	Connector.trackArtSelector = '.img-album img';

	Connector.artistSelector = '.artist_name a';

	Connector.trackSelector = '#js-product-name-0 p';

	Connector.pauseButtonSelector = '.pause';
}
