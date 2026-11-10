export {};

Connector.playerSelector = 'body';
Connector.useTabAudibleApi();

Connector.getArtistTrack = () => {
	const title = navigator.mediaSession.metadata?.title ?? '';
	const artist = navigator.mediaSession.metadata?.artist ?? '';

	if (title === 'Poolsuite ON AIR') {
		const text =
			document.querySelector('h2.font-everyday')?.textContent ?? '';
		return Util.processSoundCloudTrack(text);
	}

	const result = Util.processSoundCloudTrack(title);
	if (result.artist && result.track) {
		return result;
	}
	return { artist, track: title };
};
