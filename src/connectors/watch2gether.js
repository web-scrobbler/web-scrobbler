'use strict';

const trackInfo = {};

Connector.playButtonSelector = '.w2g-player .play';

Connector.getArtistTrack = () => trackInfo.artistTrack;

Connector.getUniqueID = () => trackInfo.uniqueId;

Connector.timeInfoSelector = '.player-time';

Connector.applyFilter(MetadataFilter.getYoutubeFilter());

function setupObserver() {
	const playerContainer = document.querySelector('.w2g-player');
	const observer = new MutationObserver(updateState);

	observer.observe(playerContainer, {
		childList: true,
		subtree: true,
		attributes: true
	});
}

function updateState() {
	const chatProviderItems = document.querySelectorAll('.w2g-chat-provider');
	const chatProviderItem = [...chatProviderItems].filter((chatItem) => {
		// Skip items w/o additional classes
		return chatItem.classList.length > 1;
	}).pop();

	if (!chatProviderItem) {
		return;
	}

	const chatTextItem = chatProviderItem.nextElementSibling;

	const type = chatProviderItem.classList[1] || 'unknown';
	const title = chatTextItem.textContent;
	const url = chatTextItem.href;

	trackInfo.artistTrack = Util.processYoutubeVideoTitle(title);
	trackInfo.uniqueId = getVideoId(type, url);

	Connector.onStateChanged();
}

function getVideoId(type, url) {
	switch (type) {
		case 'youtube':
			return Util.getYoutubeVideoIdFromUrl(url);
	}

	return `${type}:${url}`;
}

setupObserver();
