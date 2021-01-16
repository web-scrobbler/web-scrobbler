'use strict';

const filter = MetadataFilter.createFilter({
	track: removeDecorationText,
	artist: selectPrimaryName,
});

const videoSelector = '.MainVideoPlayer > video';

Connector.playerSelector = '.PlayerContainer';

Connector.artistSelector = '.VideoOwnerInfo-pageLink';

Connector.trackSelector = '.VideoTitle';

Connector.isPlaying = () => {
	const video = document.querySelector(videoSelector);
	if (!video) {
		return false;
	}

	return video.currentTime > 0 && !video.paused && !video.ended;
};

Connector.getUniqueID = () => window.location.pathname.replace(/\/$/, '').replace(/.*\//, '');

Connector.applyFilter(filter);

function removeDecorationText(text) {
	// Usual track name on Niconico is something like "【Hatsune Miku】Track Name【Original】"
	const decorationPattern = /^【[^】]*】\s*|\s*【[^【]*】$|^\[[^\]]*\]\s*|\s*\[[^[]*\]$/g;
	// Or, something like "Track Name / Composer, Singer, etc."
	const extraInfoPattern = /\s*(\/[^/]+|／[^／]+|\s-\s[^-]+|\sfeat\..+|\sft\..+)$/i;
	// Or, something like "Original Song『Track Name』MV"
	const titlePattern = /「(.+)」|『(.+)』/;

	const match = text.match(titlePattern);
	if (match) {
		return match[1] || match[2];
	}

	return text.replaceAll(decorationPattern, '').replace(extraInfoPattern, '');
}

function selectPrimaryName(text) {
	// Some artists show their alternative name as "Artist Name / Alternative Artist Name"
	// or "Artist Name(Alternative Artist Name)"
	const namePattern = /^(.+?)\s*([/／].+|\([^(]+\)$|（[^（]+）$)/;
	const match = text.match(namePattern);
	if (match) {
		return match[1];
	}

	return text;
}
