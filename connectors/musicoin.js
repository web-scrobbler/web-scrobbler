'use strict';

Connector.getArtist = () => {
	return getIframeElement('#player-artist').first().text();
};

Connector.getTrack = () => {
	return getIframeElement('#player-title').first().text();
};

Connector.getDuration = () => {
	const duration = getIframeElement('#player-time-left').text();
	return Util.stringToSeconds(duration);
};

Connector.getCurrentTime = () => {
	const currentTime = getIframeElement('#player-time-played').text();
	return Util.stringToSeconds(currentTime);
};

Connector.isPlaying = () => {
	const playButton = getIframeElement('#player-play-button');
	return playButton.css('display') === 'none';
};

Connector.getTrackArt = () => {
	const imageSrc = getIframeElement('#player-badge-image').attr('src');
	const url = `${window.location.protocol}//${window.location.host}${imageSrc}`;
	return url;
};

Connector.getUniqueID = () => {
	const trackUrl = getIframeElement('#player').attr('src');
	if (trackUrl) {
		return trackUrl.split('/').pop();
	}
	return null;
};

Connector.filter = MetadataFilter.getRemasteredFilter();

/**
 * Find element in player iframe content.
 * @param  {String} selector CSS selector
 * @return {Object} Found element
 */
function getIframeElement(selector) {
	return $('#playerFrame').contents().find(selector);
}

/**
 * Manually set up observer on player markup inside iframe
 */
function onPlayerLoaded() {
	console.log('Web Scrobbler: player loaded, setting up observer');
	const observer = new MutationObserver(Connector.onStateChanged);
	const observeTarget = $('#playerFrame').get(0).contentDocument.getElementById('player-section');
	const config = {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true
	};
	observer.observe(observeTarget, config);
}

/**
 * Crudely poll for readyState to hook up observer
 * due to no onload event firing on iframe
 */
const timer = setInterval(() => {
	const iframe = document.getElementById('playerFrame');
	const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
	if (iframeDoc.readyState === 'complete' || iframeDoc.readyState === 'interactive') {
		onPlayerLoaded();
		clearInterval(timer);
	}
}, 2000);
