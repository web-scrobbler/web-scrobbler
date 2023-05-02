export {};

Connector.getArtist = () => {
	return getIframeElement('#player-artist')?.textContent;
};

Connector.getTrack = () => {
	return getIframeElement('#player-title')?.textContent;
};

Connector.getDuration = () => {
	const duration = getIframeElement('#player-time-left')?.textContent;
	return Util.stringToSeconds(duration);
};

Connector.getCurrentTime = () => {
	const currentTime = getIframeElement('#player-time-played')?.textContent;
	return Util.stringToSeconds(currentTime);
};

Connector.isPlaying = () => {
	const playButton = getIframeElement('#player-play-button');
	if (!playButton) {
		return false;
	}
	return Util.getCSSProperty(playButton, 'display') === 'none';
};

Connector.getTrackArt = () => {
	const imageSrc = getIframeElement('#player-badge-image')?.getAttribute(
		'src'
	);
	const url = `${window.location.protocol}//${window.location.host}${imageSrc}`;
	return url;
};

Connector.getUniqueID = () => {
	const trackUrl = getIframeElement('#player')?.getAttribute('src');
	if (trackUrl) {
		return trackUrl.split('/').at(-1);
	}
	return null;
};

Connector.applyFilter(MetadataFilter.createRemasteredFilter());

/**
 * Find element in player iframe content.
 * @param selector - CSS selector
 * @returns Found element
 */
function getIframeElement(selector: string) {
	const frame = document.querySelector('#playerFrame') as HTMLIFrameElement;
	const content = frame.contentDocument || frame.contentWindow?.document;
	return content?.querySelector(selector);
}

/**
 * Manually set up observer on player markup inside iframe
 */
function onPlayerLoaded() {
	Util.debugLog('Player loaded, setting up observer');

	const observer = new MutationObserver(Connector.onStateChanged);
	const observeTarget = (
		document.querySelector('#playerFrame') as HTMLIFrameElement
	).contentDocument?.getElementById('player-section');
	const config = {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true,
	};
	if (!observeTarget) {
		return;
	}
	observer.observe(observeTarget, config);
}

/**
 * Crudely poll for readyState to hook up observer
 * due to no onload event firing on iframe
 */
const timer = setInterval(() => {
	const iframe = document.getElementById('playerFrame') as HTMLIFrameElement;
	const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
	if (
		iframeDoc?.readyState === 'complete' ||
		iframeDoc?.readyState === 'interactive'
	) {
		onPlayerLoaded();
		clearInterval(timer);
	}
}, 2000);
