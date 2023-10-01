export {};

Connector.playerSelector = 'main';

Connector.playButtonSelector = '.r-play-button';

Connector.getArtistTrack = () => {
	const artistTrackContainer = getArtistTrackContainer();
	if (artistTrackContainer) {
		return Util.splitArtistTrack(artistTrackContainer.textContent);
	}

	return null;
};

function getArtistTrackContainer() {
	/*
	 * <div class="RadioHeader__WidgetContent-sc-17ofob1-4 irUZCR">
	 *   <i class="MaterialIcon__Icon-sc-1m3ozx6-0 kLFDRs">music_note</i>
	 *   Artist - Track
	 * </div>
	 */

	const containers = document.querySelectorAll(
		'[class^=RadioHeader__WidgetContent]',
	);

	for (const container of containers) {
		for (const child of container.childNodes) {
			if (child.textContent === 'music_note') {
				return container.lastChild;
			}
		}
	}

	return null;
}
