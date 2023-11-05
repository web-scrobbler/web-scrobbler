export {};

const filter = MetadataFilter.createFilter({
	track: removeMV,
});

let trackInfo = {};
let timeInfo = {};
let isPlaying = false;

Connector.getTimeInfo = () => {
	const { currentTime, duration } = document.querySelector(
		'#aPlayer',
	) as HTMLAudioElement;
	return { currentTime, duration };
};

Connector.playerSelector = '.m-upload-list';

Connector.applyFilter(filter);

Connector.injectScript('./connectors/eggs-dom-inject.js');

if (window.location.href.includes('/artist/')) {
	setupArtistPlayer();
} else {
	setupSongPlayer();
}

function setupYoutubePlayer() {
	Connector.getTrackInfo = () => trackInfo;

	Connector.isPlaying = () => isPlaying;

	Connector.getTimeInfo = () => timeInfo;
}

function setupArtistPlayer() {
	const observer = new MutationObserver(checkToggleArtist);

	observer.observe(document.body, { childList: true });

	setArtistConnector();
}

function setArtistConnector() {
	Connector.getTrackInfo = () => {
		const currTrack =
			document.querySelector('.pause[style*="display: block"]') ||
			document.querySelector('.playw:hover');

		const parentLi = currTrack?.closest('li');
		if (!parentLi) {
			return;
		}

		const songInfo = {
			artist: parentLi?.querySelector('.artist_name')?.textContent,
			track: (parentLi?.querySelector('.player') as HTMLElement).dataset
				.srcname,
			trackArt: (parentLi?.querySelector('img') as HTMLImageElement).src,
		};

		return songInfo;
	};

	Connector.isPlaying = () =>
		document.querySelectorAll('.pause[style*="display: block;"]').length !==
		0;
}

function setupSongPlayer() {
	Connector.trackArtSelector = '.img-album img';

	Connector.artistSelector = '.artist_name a';

	Connector.trackSelector = '#js-product-name-0 p';

	Connector.pauseButtonSelector = '.pause';
}

function checkToggleArtist(mutationList: MutationRecord[]) {
	const removedList = mutationList[0].removedNodes;

	if (removedList.length) {
		// external player has been closed
		if (
			(removedList[0] as HTMLElement).classList.contains(
				'fancybox-overlay',
			)
		) {
			setArtistConnector();
		}
	}
}

Connector.onScriptEvent = (event: MessageEvent<Record<string, unknown>>) => {
	trackInfo = event.data.trackInfo as object;
	isPlaying = event.data.isPlaying as boolean;
	timeInfo = event.data.timeInfo as object;

	if (event.data.playerType === 'youtube') {
		Connector.onStateChanged();
	} else if (event.data.playerType === 'youtubestart') {
		setupYoutubePlayer();
	}
};

function removeMV(text: string) {
	return text.replace(/(\(MV\)|【MV】|MV)$/, '');
}
