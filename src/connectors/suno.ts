export {};

const durationSelector = 'span[aria-label^="Playbar: Duration for"]';

Connector.playerSelector = 'div:has(audio)';

Connector.artistSelector = 'a[aria-label^="Playbar: Artist"]';

Connector.trackSelector = 'a[aria-label^="Playbar: Title"]';

Connector.trackArtSelector = 'img[aria-label^="Playbar: Cover image"]';

Connector.getCurrentTime = () => {
	const timeSpan = document.querySelector(durationSelector);

	const [currentTimeStr] = timeSpan?.textContent?.split('/') ?? [null, null];

	return Util.stringToSeconds(currentTimeStr ?? '');
};

Connector.getDuration = () => {
	const timeSpan = document.querySelector(durationSelector);

	const [_, durationStr] = timeSpan?.textContent?.split('/') ?? [null, null];

	return Util.stringToSeconds(durationStr ?? '');
};

Connector.playButtonSelector = 'button[aria-label^="Playbar: Play button"]';
