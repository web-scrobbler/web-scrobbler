export {};

Connector.playerSelector = 'main > div:nth-child(2) > div';

Connector.isPlaying = () => {
	return (
		document.querySelectorAll('[data-testid="PauseCircleIcon"]').length > 0
	);
};

Connector.getTrack = () => {
	// this seems to be the only specific element
	const main = document.querySelector('main');

	// the player bar is the second child of main
	if (main?.children?.length === 2) {
		const player = main.children[1];
		// yeah, this might be quite brittle, but the page isn't using meaningful classes or IDs...
		const trackInfoNode = player.querySelectorAll('.MuiGrid-item').item(0)
			.lastChild?.firstChild;
		return trackInfoNode?.textContent;
	}

	return null;
};

Connector.getArtist = () => {
	const main = document.querySelector('main');

	if (main?.children?.length === 2) {
		const player = main.children[1];
		const artistInfoNode = player.querySelectorAll('.MuiGrid-item').item(0)
			.lastChild?.lastChild;
		return artistInfoNode?.textContent;
	}

	return null;
};

Connector.getCurrentTime = () => {
	const main = document.querySelector('main');

	if (main?.children?.length === 2) {
		const player = main.children[1];
		const currentTimeNode =
			player.children[0]?.children[0]?.children[1]?.firstChild;
		return Util.stringToSeconds(currentTimeNode?.textContent);
	}

	return null;
};

Connector.getDuration = () => {
	const main = document.querySelector('main');

	if (main?.children?.length === 2) {
		const player = main.children[1];
		const durationNode =
			player.children[0]?.children[0]?.children[1]?.lastChild;
		return Util.stringToSeconds(durationNode?.textContent);
	}

	return null;
};
