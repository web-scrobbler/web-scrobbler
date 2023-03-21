export {};

setupConnector();

function setupConnector() {
	if (isMainPage()) {
		setupMainPagePlayer();
	} else {
		setupDefaultPlayer();
	}
}

function isMainPage() {
	return (
		location.href === 'http://bandzone.cz/' ||
		location.href === 'https://bandzone.cz/'
	);
}

function setupMainPagePlayer() {
	Connector.playerSelector = '#stats';

	Connector.artistSelector =
		'.stat:has(.ui-miniaudioplayer-state-playing) h4';

	Connector.trackSelector =
		'.stat:has(.ui-miniaudioplayer-state-playing) .songTitle';

	Connector.isPlaying = () =>
		Boolean(document.querySelector('.ui-miniaudioplayer-state-playing'));
}

function setupDefaultPlayer() {
	const filter = MetadataFilter.createFilter({ artist: removeGenre });

	Connector.playerSelector = '#playerWidget';

	Connector.artistSelector = '.profile-name h1';

	Connector.trackSelector = '.ui-state-active .ui-audioplayer-song-title';

	Connector.timeInfoSelector = '.ui-audioplayer-time';

	Connector.isPlaying = () =>
		Util.getTextFromSelectors('.ui-audioplayer-button') === 'stop';

	Connector.applyFilter(filter);

	function removeGenre(text: string) {
		const genre = Util.getTextFromSelectors('.profile-name span');
		return text.replace(genre ?? '', '');
	}
}
