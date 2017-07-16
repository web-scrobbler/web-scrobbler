'use strict';

Connector.getArtist = () => {
	return findIframeElement('#track-artist a').first().text();
};

Connector.getTrack = () => {
	return findIframeElement('#track-name a').first().text();
};

Connector.getDuration = () => {
	let durationStr = findIframeElement('#track-length').text();
	return Util.stringToSeconds(durationStr);
};

Connector.getCurrentTime = () => {
	let currentTimeStr = findIframeElement('#track-current').text();
	return Util.stringToSeconds(currentTimeStr);
};

Connector.isPlaying = () => {
	let playButton = findIframeElement('#play-pause');
	return playButton.hasClass('playing');
};

Connector.getTrackArt = () => {
	let backgroundStyle = findIframeElement('.sp-image-img')
		.css('background-image');
	return Util.extractUrlFromCssProperty(backgroundStyle);
};

Connector.getUniqueID = () => {
	let trackUrl = findIframeElement('#track-name a').attr('href');
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
function findIframeElement(selector) {
	return $('#app-player').contents().find(selector);
}

function onPlayerLoaded() {
	console.log('Web Scrobbler: player loaded, setting up observer');
	let observer = new MutationObserver(Connector.onStateChanged);
	let observeTarget = $('#app-player').get(0).contentDocument.getElementById('wrap');
	let config = {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true
	};
	observer.observe(observeTarget, config);
}

// wait for player to load
$('#app-player').on('load', onPlayerLoaded);
