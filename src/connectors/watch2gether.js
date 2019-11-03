'use strict';

Connector.playerSelector = '.w2g-player';

Connector.playButtonSelector = '.w2g-player .play';

Connector.getTrackInfo = () => {
	const chatProviderItems = document.querySelectorAll('.w2g-chat-provider');
	const chatProviderItem = [...chatProviderItems].filter((chatItem) => {
		// Skip items w/o additional classes
		return chatItem.classList.length > 1;
	}).pop();

	if (!chatProviderItem) {
		return {};
	}

	const chatTextItem = chatProviderItem.nextElementSibling;

	const type = chatProviderItem.classList[1] || 'unknown';
	const title = chatTextItem.textContent;
	const url = chatTextItem.href;

	const { artist, track } = Util.processYtVideoTitle(title);
	const uniqueID = getVideoId(type, url);

	return { artist, track, uniqueID };

};

Connector.timeInfoSelector = '.player-time';

Connector.applyFilter(MetadataFilter.getYoutubeFilter());

function getVideoId(type, url) {
	switch (type) {
		case 'youtube':
			return Util.getYtVideoIdFromUrl(url);
	}

	return `${type}:${url}`;
}
