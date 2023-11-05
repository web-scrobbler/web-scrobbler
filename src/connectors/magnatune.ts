export {};

const artistSelector = "a[href^='/artists']";

const trackRegex = /(.+)\[(\.)?/;

Connector.playerSelector = '#paper';

Connector.artistSelector = artistSelector;

Connector.getTrack = () => {
	const playingImg = document.querySelector('#songlist img');

	if (!playingImg) {
		return null;
	}

	const trackContent =
		playingImg.closest('td')?.nextElementSibling?.textContent;
	const matched = trackContent?.match(trackRegex);
	if (!matched) {
		return null;
	}

	return matched[1];
};

Connector.getAlbum = () => {
	const artistElement = document.querySelector(artistSelector);

	return artistElement
		?.closest('font')
		?.textContent?.replace(artistElement?.textContent ?? '', '')
		.slice(1);
};

Connector.isPlaying = () =>
	document.querySelectorAll('#hugeplay a').length === 3;
