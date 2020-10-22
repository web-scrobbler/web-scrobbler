'use strict';

/*
 * This script runs in non-isolated environment(eggs.mu itself)
 * for accessing window variables
 */

const isArtistPage = window.location.href.includes('/artist/');
let frameID = '';
let currentTime = 0;
let duration = 0;

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
			return null;
		}
		// external player has been closed
		if (removedList[0].classList.contains('fancybox-overlay')) {
			onYoutubeClose();
			return null;
		}
	}
}

function replaceYoutubeVideo() {
	const videoFrame = document.querySelector('.fancybox-inner iframe');
	videoId = videoFrame.src.split('/').pop().split('?')[0];

	videoFrame.src += '&enablejsapi=1&widgetid=1';
	frameID = videoFrame.id;

	videoFrame.addEventListener('load', function() {
		let message = JSON.stringify({
			event: 'listening',
			id: frameID,
			channel: 'widget',
		});
		videoFrame.contentWindow.postMessage(message, 'https://www.youtube.com');

		message = JSON.stringify({
			event: 'command',
			func: 'addEventListener',
			args: ['onStateChange'],
			id: frameID,
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
			break;
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
			currentTime: currentTime || 0,
			duration,
		},
		trackInfo: {
			artist: parentElmt.querySelector(`.artist_name${(isArtistPage) ? '' : ' a'}`).textContent,
			track: parentElmt.querySelector(`.product_name${(isArtistPage) ? ' a' : ' p'}`).textContent,
		},
	}, '*');
}

function onYoutubeClose() {
	const currentPlayer = document.querySelector(`a[href*="${videoId}"]`);
	const parentElmt = (currentPlayer && currentPlayer.closest('li')) || document;
	window.postMessage({
		sender: 'web-scrobbler',
		playerType: 'youtube',
		isPlaying: false,
		timeInfo: {
			currentTime,
			duration,
		},
		trackInfo: {
			artist: parentElmt.querySelector(`.artist_name${(isArtistPage) ? '' : ' a'}`).textContent,
			track: parentElmt.querySelector(`.product_name${(isArtistPage) ? ' a' : ' p'}`).textContent,
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
			artist: parentElmt.querySelector(`.artist_name${(isArtistPage) ? '' : ' a'}`).textContent,
			track: parentElmt.querySelector(`.product_name${(isArtistPage) ? ' a' : ' p'}`).textContent,
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
