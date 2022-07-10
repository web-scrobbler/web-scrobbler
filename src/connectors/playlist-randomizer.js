'use strict';

Connector.playerSelector = '#root';
Connector.trackArtSelector = '.Mui-selected .MuiListItemAvatar-root .MuiAvatar-circular .MuiAvatar-img';

const trackSelector = '.Mui-selected .MuiListItemText-root .MuiListItemText-primary';

Connector.isPlaying = () => {
	const playButton = document.querySelector('button[title="Play"]');
	const tooltip = document.querySelector('.MuiTooltip-popper');
	const tooltipText = tooltip ? tooltip.innerText : '';

	if (playButton || tooltipText.includes('Play')) {
		return false;
	}

	return true;
};

Connector.getArtistTrack = () => {
	const currentTrack = document.querySelector(trackSelector);
	if (!currentTrack) {
		return;
	}
	let { artist, track } = Util.processYtVideoTitle(currentTrack.firstChild.nodeValue);

	// Set to some default information that we have so that the user can edit the info in the extension
	if (!artist) {
		const regex = /^(.*) - Topic$/;
		artist = currentTrack.lastChild.innerText.replace(regex, '$1');
	}
	if (!track) {
		track = currentTrack.firstChild.nodeValue;
	}

	return { artist, track };
};

Connector.applyFilter(MetadataFilter.getYoutubeFilter());
Connector.onReady = Connector.onStateChanged;
