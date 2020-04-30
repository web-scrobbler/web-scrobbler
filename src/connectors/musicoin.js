'use strict';

const iframeId = 'playerFrame';

Connector.getArtist = () => getIframeElementText('#player-artist');

Connector.getTrack = () => getIframeElementText('#player-title');

Connector.getDuration = () => {
	const duration = getIframeElementText('#player-time-left');
	return Util.stringToSeconds(duration);
};

Connector.getCurrentTime = () => {
	const currentTime = getIframeElementText('#player-time-played');
	return Util.stringToSeconds(currentTime);
};

Connector.isPlaying = () => {
	const playButton = getIframeElement('#player-play-button');
	return getComputedStyle(playButton).display === 'none';
};

Connector.getTrackArt = () => {
	const imageElement = getIframeElement('#player-badge-image');
	return imageElement && imageElement.src;
};

Connector.getUniqueID = () => {
	const trackUrlElement = getIframeElement('#player');
	if (trackUrlElement) {
		const trackUrl = trackUrlElement.getAttribute('href');
		return trackUrl && trackUrl.split('/').pop();
	}

	return null;
};

Connector.applyFilter(MetadataFilter.getRemasteredFilter());

function getIframeElement(selector) {
	const doc = getIframeDocument();
	return doc && doc.querySelector(selector);
}

function getIframeElementText(selector) {
	const element = getIframeElement(selector);
	return element && element.textContent;
}

function getIframeDocument() {
	const iframe = document.getElementById(iframeId);
	return iframe && (iframe.contentDocument || iframe.contentWindow.document);
}

/**
 * Manually set up observer on player markup inside iframe
 */
function onPlayerLoaded() {
	Util.debugLog('Player loaded, setting up observer');

	const observer = new MutationObserver(Connector.onStateChanged);
	const observeTarget = getIframeElement('#player-section');
	const config = {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true,
	};
	observer.observe(observeTarget, config);
}

/**
 * Crudely poll for readyState to hook up observer
 * due to no onload event firing on iframe
 */
const timer = setInterval(() => {
	const doc = getIframeDocument();

	if (doc.readyState === 'complete' || doc.readyState === 'interactive') {
		onPlayerLoaded();
		clearInterval(timer);
	}
}, 2000);
