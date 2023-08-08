interface TrackInfo {
	title: string;
	credits: string;
	duration: number;
	id: string;
	image: { src: string };
	release_title: string;
}

interface QueueEventObject {
	Queue: QueueEventObject;
	currentTrack: TrackInfo;
	Player: { currentTime: number };
}

function sberGetTrackInfo(track: TrackInfo, currentTime: number) {
	const { title, credits, duration, id, image, release_title: album } = track;
	const trackArt = image.src.replace('{size}', '400x400');

	return {
		track: title,
		artist: credits,
		uniqueID: id,
		duration,
		trackArt,
		currentTime,
		album,
	};
}

function sberQueueEvent(event: {
	type: string;
	name: string;
	newValue: unknown;
	object: QueueEventObject;
}) {
	let type = null;
	let queue;

	if (event.type !== 'update') {
		return;
	}

	switch (event.name) {
		case 'state':
			type = event.newValue;
			queue = event.object.Queue;
			break;
		case 'currentTime':
		case 'current_idx':
			queue =
				event.name === 'current_idx'
					? event.object
					: event.object.Queue;
			type = 'currentTime';
			break;
		default:
			return;
	}

	const trackInfo = sberGetTrackInfo(
		queue.currentTrack,
		queue.Player.currentTime,
	);

	window.postMessage(
		{
			sender: 'web-scrobbler',
			type,
			trackInfo,
		},
		'*',
	);
}

function sberSetupEventListeners() {
	(
		window as unknown as {
			newPlayer: { $mobx: { observe: (ev: object) => void } };
		}
	).newPlayer.$mobx.observe(sberQueueEvent);
}

sberSetupEventListeners();
