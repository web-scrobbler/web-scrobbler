/*
 * This script runs in non-isolated environment(eggs.mu itself)
 * for accessing window variables
 */

const eggsIsArtistPage = window.location.href.includes('/artist/');
let eggsFrameID = '';
let eggsCurrentTime = 0;
let eggsDuration = 0;

let eggsVideoId: string | undefined = '';

if (eggsIsArtistPage) {
	const observer = new MutationObserver(eggsToggleExternalPlayer);

	observer.observe(document.body, { childList: true });
} else if ('player' in window) {
	(
		window.player as {
			addEventListener: (
				_: string,
				__: (ev: {
					data: number;
					target: {
						getCurrentTime: () => number;
						getDuration: () => number;
					};
				}) => void,
			) => void;
		}
	).addEventListener('onStateChange', eggsOnYoutubeSongStateChange);
}

function eggsToggleExternalPlayer(mutationList: MutationRecord[]) {
	const removedList = mutationList[0].removedNodes;

	if (removedList.length) {
		// external player has been started
		if ((removedList[0] as HTMLElement).id === 'fancybox-loading') {
			eggsReplaceYoutubeVideo();
			return null;
		}
		// external player has been closed
		if (
			(removedList[0] as HTMLElement).classList.contains(
				'fancybox-overlay',
			)
		) {
			eggsOnYoutubeClose();
			return null;
		}
	}
}

function eggsReplaceYoutubeVideo() {
	const videoFrame = document.querySelector(
		'.fancybox-inner iframe',
	) as HTMLIFrameElement;
	eggsVideoId = videoFrame.src.split('/').pop()?.split('?')[0];

	videoFrame.src += '&enablejsapi=1&widgetid=1';
	eggsFrameID = videoFrame.id;

	videoFrame.addEventListener('load', function () {
		let message = JSON.stringify({
			event: 'listening',
			id: eggsFrameID,
			channel: 'widget',
		});
		videoFrame.contentWindow &&
			videoFrame.contentWindow.postMessage(
				message,
				'https://www.youtube.com',
			);

		message = JSON.stringify({
			event: 'command',
			func: 'addEventListener',
			args: ['onStateChange'],
			id: eggsFrameID,
			channel: 'widget',
		});
		videoFrame.contentWindow &&
			videoFrame.contentWindow.postMessage(
				message,
				'https://www.youtube.com',
			);
	});
}

window.addEventListener('message', (event) => {
	if (event.origin !== 'https://www.youtube.com') {
		return;
	}
	// eslint-disable-next-line
	const data = JSON.parse(event.data);
	// eslint-disable-next-line
	switch (data.event) {
		case 'onStateChange':
			// eslint-disable-next-line
			eggsOnYoutubeStateChange(data);
			break;
		case 'infoDelivery':
			// eslint-disable-next-line
			eggsGetTimestamps(data);
			break;
	}
});

function eggsOnYoutubeStateChange(data: { info: number }) {
	const currentPlayer = document.querySelector(`a[href*="${eggsVideoId}"]`);
	const parentElmt =
		(currentPlayer && currentPlayer.closest('li')) || document;
	const playerTypeSuffix = data.info === -1 ? 'start' : '';

	window.postMessage(
		{
			sender: 'web-scrobbler',
			playerType: `youtube${playerTypeSuffix}`,
			isPlaying: data.info === 1,
			timeInfo: {
				currentTime: eggsCurrentTime || 0,
				duration: eggsDuration,
			},
			trackInfo: {
				artist: parentElmt.querySelector(
					`.artist_name${eggsIsArtistPage ? '' : ' a'}`,
				)?.textContent,
				track: parentElmt.querySelector(
					`.product_name${eggsIsArtistPage ? ' a' : ' p'}`,
				)?.textContent,
			},
		},
		'*',
	);
}

function eggsOnYoutubeClose() {
	const currentPlayer = document.querySelector(`a[href*="${eggsVideoId}"]`);
	const parentElmt =
		(currentPlayer && currentPlayer.closest('li')) || document;
	window.postMessage(
		{
			sender: 'web-scrobbler',
			playerType: 'youtube',
			isPlaying: false,
			timeInfo: {
				eggsCurrentTime,
				eggsDuration,
			},
			trackInfo: {
				artist: parentElmt.querySelector(
					`.artist_name${eggsIsArtistPage ? '' : ' a'}`,
				)?.textContent,
				track: parentElmt.querySelector(
					`.product_name${eggsIsArtistPage ? ' a' : ' p'}`,
				)?.textContent,
			},
		},
		'*',
	);
}

function eggsOnYoutubeSongStateChange(event: {
	data: number;
	target: { getCurrentTime: () => number; getDuration: () => number };
}) {
	const currentPlayer = document.querySelector(`a[href*="${eggsVideoId}"]`);
	const parentElmt =
		(currentPlayer && currentPlayer.closest('li')) || document;
	const playerTypeSuffix = event.data === -1 ? 'start' : '';

	window.postMessage(
		{
			sender: 'web-scrobbler',
			playerType: `youtube${playerTypeSuffix}`,
			isPlaying: event.data === 1,
			timeInfo: {
				currentTime: event.target.getCurrentTime(),
				duration: event.target.getDuration(),
			},
			trackInfo: {
				artist: parentElmt.querySelector(
					`.artist_name${eggsIsArtistPage ? '' : ' a'}`,
				)?.textContent,
				track: parentElmt.querySelector(
					`.product_name${eggsIsArtistPage ? ' a' : ' p'}`,
				)?.textContent,
			},
		},
		'*',
	);
}

function eggsGetTimestamps(data: {
	info?: { currentTime?: number; duration?: number };
}) {
	if (data.info) {
		if (data.info.currentTime) {
			eggsCurrentTime = data.info.currentTime;
		}
		if (data.info.duration) {
			eggsDuration = data.info.duration;
		}
	}
}
