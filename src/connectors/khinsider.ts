Connector.trackSelector = '#songlist > tbody > tr.plSel > .clickable-row a';

Connector.isPlaying = () =>
	document.querySelectorAll('.audioplayerPlayPause span .material-icons')[0]
		.textContent === 'pause';

Connector.durationSelector = '.audioplayerTimeDuration';

Connector.currentTimeSelector = '.audioplayerTimeCurrent';

Connector.albumSelector = '#pageContent > h2:nth-child(2)';

Connector.artistSelector =
	'#pageContent > p:nth-child(3 of :not(.albuminfoAlternativeTitles))';

const filter = MetadataFilter.createFilter({
	artist: cleanupArtist,
});
Connector.applyFilter(filter);

function cleanupArtist(text: string) {
	const composers = /Composed by:? (.*)/gim.exec(text);
	const developers = /Developed by:? (.+)/gim.exec(text);
	if (composers) {
		return composers[1];
	} else if (developers) {
		return developers[1];
	}
	return Connector.getAlbum() ?? '';
}

Connector.trackArtSelector =
	'div.albumImage:nth-child(1) > a:nth-child(1) > img:nth-child(1)';

Connector.playerSelector = '.audioplayer';
