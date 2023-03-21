export {};

const filter = MetadataFilter.createFilter({
	track: removeDecorationText,
	artist: selectPrimaryName,
});

const videoSelector = '.MainVideoPlayer > video';

Connector.playerSelector = '.PlayerContainer';

Connector.artistSelector = '.VideoOwnerInfo-pageLink';

Connector.trackSelector = '.VideoTitle';

Connector.durationSelector = '.PlayerPlayTime-duration';

Connector.currentTimeSelector = '.PlayerPlayTime-playtime';

Connector.isPlaying = () => {
	const video = document.querySelector(videoSelector) as HTMLVideoElement;
	if (!video) {
		return false;
	}

	return video.currentTime > 0 && !video.paused && !video.ended;
};

Connector.getUniqueID = () =>
	window.location.pathname.replace(/\/$/, '').replace(/.*\//, '');

Connector.applyFilter(filter);

function removeDecorationText(text: string) {
	// Usual track name on Niconico is something like "【Hatsune Miku】Track Name【Original】"
	const decorationPattern =
		/^【[^】]*】\s*|\s*【[^【]*】$|^\[[^\]]*\]\s*|\s*\[[^[]*\]$/g;
	// Or, something like "Track Name / Composer, Singer, etc."
	const extraInfoPattern =
		/\s*(\/[^/]+|／[^／]+|[^\da-zA-Z]-[^\da-zA-Z][^-]+|\sfeat\..+|\sft\..+)$/i;
	// Or, something like "Original Song『Track Name』MV"
	const titlePattern = /「(.+)」|『(.+)』|'(.+)'|"(.+)"/;

	const match = text.match(titlePattern);
	if (match) {
		return match[1] || match[2] || match[3] || match[4];
	}

	return text.replace(decorationPattern, '').replace(extraInfoPattern, '');
}

function selectPrimaryName(text: string) {
	// Niconico shows the artist name like "Artist さん" when you're a Japanese user
	const nameWithoutSuffix = text.replace(/\sさん$/, '');

	// Some artists show their alternative name as "Artist Name / Alternative Artist Name"
	// or "Artist Name(Alternative Artist Name)"
	const namePattern = /^(.+?)\s*([/／].+|\([^(]+\)$|（[^（]+）$)/;
	const match = nameWithoutSuffix.match(namePattern);
	if (match) {
		return match[1];
	}

	return nameWithoutSuffix;
}
