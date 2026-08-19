export {};

interface CurrentChannel {
	artist: string;
	cover: string;
	title: string;
}

interface Channel {
	artist: string;
	title: string;
	img: string;
	current?: CurrentChannel;
}

declare global {
	interface Window {
		ilr3: {
			radio: { playing: boolean };
			channel: number;
			channelSequence: {
				id: string;
				channel?: Channel;
			}[];
		};
		cleanup?: () => void;
	}
}

if ('cleanup' in window && typeof window.cleanup === 'function') {
	window.cleanup();
}

window.cleanup = (() => {
	function getArtwork(data: Channel | CurrentChannel) {
		if ('img' in data) {
			return data.img;
		} else if ('cover' in data) {
			return data.cover;
		}
	}

	function listener() {
		const { channel, radio, channelSequence } = window.ilr3;
		const id = String(channel);
		const target = channelSequence.find((x) => x.id === id);
		const data = target?.channel?.current || target?.channel;
		if (data) {
			window.postMessage(
				{
					sender: 'web-scrobbler',
					type: 'ILOVEMUSIC_STATE',
					state: {
						getTrack: data.title,
						getArtist: data.artist,
						getTrackArt: getArtwork(data),
						isPlaying: radio.playing,
					},
				},
				'*',
			);
		}
	}

	const observer = new MutationObserver(listener);

	observer.observe(document.getElementById('ilrplayer') as Node, {
		childList: true,
	});

	observer.observe(document.getElementById('above_player_inner') as Node, {
		childList: true,
	});

	return () => {
		observer.disconnect();
	};
})();
