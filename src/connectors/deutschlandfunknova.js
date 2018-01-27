'use strict';

Connector.playerSelector = '.play-btn';

Connector.artistTrackSelector = '.meta-data .playing-title';

Connector.getArtistTrack = () => {
	if ($(Connector.artistTrackSelector).text().length > 7 && $(Connector.artistTrackSelector).text().indexOf('undefined') === -1) {
		let text = $(Connector.artistTrackSelector).text();
		let m = text.split(' · ');
		if (m && (m.length > 0)) {
			let n = m[0].match(/"(.*)" von (.*)/);
			if (n && (n.length === 3)) {
				return { artist: n[2], track: n[1] };
			}
		}
	}

	return Util.makeEmptyArtistTrack();
};

Connector.isPlaying = () => {
	return $(Connector.playerSelector).hasClass('jp-option-pause');
};
