'use strict';

/*
 * This script runs in non-isolated environment(eggs.mu itself)
 * for accessing window variables
 */

const isArtistPage = window.location.href.includes('/artist/');
const videoFrame = document.createElement('iframe');
let currentTime = 0;
let duration = 180;

let videoId = '';

if (isArtistPage) {
	const observer = new MutationObserver(toggleExternalPlayer);

	observer.observe(document.body, { childList: true });
} else {
	window.player.addEventListener('onStateChange', onYoutubeSongStateChange);
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

	videoFrame.src = `https://www.youtube.com/embed/${videoId}?origin=https%3A%2F%2Feggs.mu&wmode=transparent&rel=0&enablejsapi=1&widgetid=1`;
	videoFrame.id = 'webscrobblerPlayer';
	videoFrame.height = 290;
	videoFrame.width = 500;
	videoFrame.style = 'display: block';
	iframeParent.append(videoFrame);

	videoFrame.addEventListener('load', function() {
		let message = JSON.stringify({
			event: 'listening',
			id: videoFrame.id,
			channel: 'widget',
		});
		videoFrame.contentWindow.postMessage(message, 'https://www.youtube.com');

		message = JSON.stringify({
			event: 'command',
			func: 'addEventListener',
			args: ['onStateChange'],
			id: videoFrame.id,
			channel: 'widget',
		});
		videoFrame.contentWindow.postMessage(message, 'https://www.youtube.com');
	});
}

window.addEventListener('message', (event) => {
	if (event.origin !== 'https://www.youtube.com') {
		return;
	}
	const data = JSON.parse(event.data);
	switch (data.event) {
		case 'onStateChange':
			onYoutubeStateChange(data);
			break;
		case 'infoDelivery':
			getTimestamps(data);
	}
});

function onYoutubeStateChange(data) {
	const currentPlayer = document.querySelector(`a[href*="${videoId}"]`);
	const parentElmt = (currentPlayer && currentPlayer.closest('li')) || document;
	const playerTypeSuffix = (data.info === -1) ? 'start' : '';

	window.postMessage({
		sender: 'web-scrobbler',
		playerType: `youtube${playerTypeSuffix}`,
		isPlaying: data.info === 1,
		timeInfo: {
			currentTime,
			duration,
		},
		trackInfo: {
			artist: parentElmt.querySelector(`.artist_name${(isArtistPage) ? '' : ' a'}`).innerText,
			track: parentElmt.querySelector(`.product_name${(isArtistPage) ? ' a' : ' p'}`).innerText,
		},
	}, '*');
}

function onYoutubeSongStateChange(event) {
	const currentPlayer = document.querySelector(`a[href*="${videoId}"]`);
	const parentElmt = (currentPlayer && currentPlayer.closest('li')) || document;
	const playerTypeSuffix = (event.data === -1) ? 'start' : '';

	window.postMessage({
		sender: 'web-scrobbler',
		playerType: `youtube${playerTypeSuffix}`,
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

function getTimestamps(data) {
	if (data.info) {
		if (data.info.currentTime) {
			currentTime = data.info.currentTime;
		}
		if (data.info.duration) {
			duration = data.info.duration;
		}
	}
}
