export {};

const filter = MetadataFilter.createFilter({ track: removeTrailingBr });

Connector.playerSelector = 'body.content';

Connector.getArtistTrack = () => {
	const trackArtist = document.querySelector(
		'#tracklist-group-1 > div > div > div:nth-child(1)',
	)?.innerHTML;

	return Util.splitArtistTrack(trackArtist, ['<br>']);
};

Connector.isPlaying = function () {
	const playButtons = document.querySelectorAll('#radio-boxes i');

	for (const playButton of playButtons) {
		if (playButton.classList.contains('fa-pause-circle')) {
			return true;
		}
	}

	return false;
};

Connector.applyFilter(filter);

function removeTrailingBr(text: string) {
	return text.replace(/<br>$/, '');
}
