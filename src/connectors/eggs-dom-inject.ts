/**
 * This script runs in non-isolated environment(eggs.mu itself)
 * for accessing window variables
 *
 * Script is run as an IIFE to ensure variables are scoped, as in the event
 * of extension reload/update a new script will have to override the current one.
 *
 * Script starts by calling window.cleanup to cleanup any potential previous script.
 *
 * @returns a cleanup function that cleans up event listeners and similar for a future overriding script.
 */

// cleanup previous script
if ('cleanup' in window && typeof window.cleanup === 'function') {
	window.cleanup();
}

(window as unknown as { cleanup: () => void }).cleanup = (() => {
	interface Player {
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
		removeEventListener: (
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

	const isArtistPage = window.location.href.includes('/artist/');
	let frameID = '';
	let currentTime = 0;
	let duration = 0;
	let videoFrameCleanUp = () => {
		/* do nothing, this will be overridden */
	};
	let observerCleanUp = () => {
		/* do nothing, this will be overridden */
	};

	let videoId: string | undefined = '';

	if (isArtistPage) {
		const observer = new MutationObserver(toggleExternalPlayer);

		observer.observe(document.body, { childList: true });
		observerCleanUp = () => {
			observer.disconnect();
		};
	} else if ('player' in window) {
		(window.player as Player).addEventListener(
			'onStateChange',
			onYoutubeSongStateChange,
		);
	}

	function toggleExternalPlayer(mutationList: MutationRecord[]) {
		const removedList = mutationList[0].removedNodes;
		const addedList = mutationList[0].addedNodes;

		if (addedList.length) {
			// external player has been started
			if (
				(addedList[0] as HTMLElement).classList.contains(
					'fancybox-type-inline',
				)
			) {
				replaceYoutubeVideo();
				return null;
			}
		}

		if (removedList.length) {
			// external player has been closed
			if (
				(removedList[0] as HTMLElement).classList.contains(
					'fancybox-overlay',
				)
			) {
				onYoutubeClose();
				return null;
			}
		}
	}

	function replaceYoutubeVideo() {
		const videoFrame = document.querySelector(
			'.fancybox-inner iframe',
		) as HTMLIFrameElement;
		videoId = videoFrame.src.split('/').pop()?.split('?')[0];

		videoFrame.src += '&enablejsapi=1&widgetid=1';

		frameID = videoFrame.id;

		function onLoad() {
			let message = JSON.stringify({
				event: 'listening',
				id: frameID,
				channel: 'widget',
			});
			if (videoFrame.contentWindow) {
				videoFrame.contentWindow.postMessage(message, '*');
			}

			message = JSON.stringify({
				event: 'command',
				func: 'addEventListener',
				args: ['onStateChange'],
				id: frameID,
				channel: 'widget',
			});
			if (videoFrame.contentWindow) {
				videoFrame.contentWindow.postMessage(message, '*');
			}
		}

		videoFrame.addEventListener('load', onLoad);

		videoFrameCleanUp = () => {
			videoFrame.removeEventListener('load', onLoad);
		};
	}

	function onMessage(event: MessageEvent<string>) {
		if (event.origin !== 'https://www.youtube.com') {
			return;
		}
		// eslint-disable-next-line
		const data = JSON.parse(event.data);
		// eslint-disable-next-line
		switch (data.event) {
			case 'onStateChange':
				// eslint-disable-next-line
				onYoutubeStateChange(data);
				break;
			case 'infoDelivery':
				// eslint-disable-next-line
				getTimestamps(data);
				break;
		}
	}

	window.addEventListener('message', onMessage);

	function onYoutubeStateChange(data: { info: number }) {
		const currentPlayer = document.querySelector(
			`.btnPaly[data-src="${videoId}"]`,
		);
		const parentElmt =
			(currentPlayer && currentPlayer.closest('li')) || document;
		const playerTypeSuffix = data.info === -1 ? 'start' : '';

		window.postMessage(
			{
				sender: 'web-scrobbler',
				playerType: `youtube${playerTypeSuffix}`,
				isPlaying: data.info === 1,
				timeInfo: {
					currentTime: currentTime || 0,
					duration,
				},
				trackInfo: {
					artist: parentElmt.querySelector(
						`.artist_name${isArtistPage ? '' : ' a'}`,
					)?.textContent,
					track: parentElmt.querySelector(
						`.product_name${isArtistPage ? ' a' : ' p'}`,
					)?.textContent,
				},
			},
			'*',
		);
	}

	function onYoutubeClose() {
		const currentPlayer = document.querySelector(`a[href*="${videoId}"]`);
		const parentElmt =
			(currentPlayer && currentPlayer.closest('li')) || document;
		window.postMessage(
			{
				sender: 'web-scrobbler',
				playerType: 'youtube',
				isPlaying: false,
				timeInfo: {
					currentTime,
					duration,
				},
				trackInfo: {
					artist: parentElmt.querySelector(
						`.artist_name${isArtistPage ? '' : ' a'}`,
					)?.textContent,
					track: parentElmt.querySelector(
						`.product_name${isArtistPage ? ' a' : ' p'}`,
					)?.textContent,
				},
			},
			'*',
		);
	}

	function onYoutubeSongStateChange(event: {
		data: number;
		target: { getCurrentTime: () => number; getDuration: () => number };
	}) {
		const currentPlayer = document.querySelector(`a[href*="${videoId}"]`);
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
						`.artist_name${isArtistPage ? '' : ' a'}`,
					)?.textContent,
					track: parentElmt.querySelector(
						`.product_name${isArtistPage ? ' a' : ' p'}`,
					)?.textContent,
				},
			},
			'*',
		);
	}

	function getTimestamps(data: {
		info?: { currentTime?: number; duration?: number };
	}) {
		if (data.info) {
			if (data.info.currentTime) {
				currentTime = data.info.currentTime;
			}
			if (data.info.duration) {
				duration = data.info.duration;
			}
		}
	}

	/**
	 * Initialize youtube in case its being reloaded with something already playing.
	 */
	function initializeYoutube() {
		const videoFrame = document.querySelector(
			'.fancybox-inner iframe',
		) as HTMLIFrameElement;
		if (!videoFrame) {
			return;
		}

		// Fire off a youtube start event. The duration and currenttime are not used.
		onYoutubeSongStateChange({
			data: -1,
			target: {
				getCurrentTime: () => 0,
				getDuration: () => 0,
			},
		});
		videoId = videoFrame.src.split('/').pop()?.split('?')[0];

		// pause and immediately unpause the video playing. This forces youtube to give currentime and duration.
		let message = JSON.stringify({
			event: 'command',
			func: 'pauseVideo',
			args: [],
			id: frameID,
			channel: 'widget',
		});
		videoFrame.contentWindow?.postMessage(message, '*');

		message = JSON.stringify({
			event: 'command',
			func: 'playVideo',
			args: [],
			id: frameID,
			channel: 'widget',
		});
		videoFrame.contentWindow?.postMessage(message, '*');
	}
	initializeYoutube();

	/**
	 * Clean up event listeners.
	 */
	return () => {
		videoFrameCleanUp();
		observerCleanUp();
		window.removeEventListener('message', onMessage);
		if (!isArtistPage || !('player' in window)) {
			return;
		}
		(window.player as Player).removeEventListener(
			'onStateChange',
			onYoutubeSongStateChange,
		);
	};
})();
