export {};

Connector.playerSelector = '.is-current-sound'
Connector.artistTrackSelector = '.text-crawl-scroll'

Connector.isPlaying = () => Util.hasElementClass('.is-current-sound', 'is-playing')
Connector.getArtistTrack = () => {
	const artistTrack = Util.getTextFromSelectors(Connector.artistTrackSelector)
	if (artistTrack) {
		return	Util.splitArtistTrack(artistTrack.split(' - ', 2)[1], [', '])
	}
}

Util.bindListeners(
	['audio'],
	['playing', 'pause', 'timeupdate'],
	Connector.onStateChanged,
);
