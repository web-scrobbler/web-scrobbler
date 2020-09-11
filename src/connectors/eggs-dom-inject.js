'use strict';

/*
 * This script runs in non-isolated environment(eggs.mu itself)
 * for accessing window variables
 */

const isArtistPage = window.location.href.includes('/artist/');

let videoId = '';

if (isArtistPage) {
	const observer = new MutationObserver(toggleExternalPlayer);

	observer.observe(document.body, { childList: true });
} else {

	window.player.addEventListener('onStateChange', youtubeStateChange);

}

function toggleExternalPlayer(mutationList) {

	const removedList = mutationList[0].removedNodes;

	if (removedList.length) {

		// external player has been started
		if (removedList[0].id === 'fancybox-loading') {

			replaceYoutubeVideo();

		}
	}
}

function replaceYoutubeVideo() {

	const iframeParent = document.querySelector('.fancybox-inner');
	videoId = iframeParent.querySelector('iframe').src.split('/').pop().split('?')[0];

	iframeParent.innerHTML = '';

	const videoDiv = document.createElement('div');
	videoDiv.id = 'webscrobblerPlayer';
	iframeParent.append(videoDiv);

	placeYoutubeVideo();

}

function placeYoutubeVideo() {
	new window.YT.Player('webscrobblerPlayer', {
		height: '290',
		width: '500',
		videoId,
		playerVars: {
			origin: 'https://eggs.mu/',
			wmode: 'transparent',
			rel: 0,
		},
		events: {
			'onStateChange': youtubeStateChange,
		},
	});
}

function youtubeStateChange(event) {

	const parentElmt = (document.querySelector(`a[href*="${videoId}"]`) && document.querySelector(`a[href*="${videoId}"]`).closest('li')) || document;

	window.postMessage({
		sender: 'web-scrobbler',
		playerType: `youtube${(event.data === -1) ? 'start' : ''}`,
		isPlaying: event.data === 1,
		timeInfo: {
			currentTime: event.target.getCurrentTime(),
			duration: event.target.getDuration(),
		},
		trackInfo: {
			artist: parentElmt.querySelector(`.artist_name${(isArtistPage) ? '' : ' a'}`).innerText,
			track: parentElmt.querySelector(`.product_name${(isArtistPage) ? ' a' : ' p'}`).innerText,
		},
	}, '*');
}
