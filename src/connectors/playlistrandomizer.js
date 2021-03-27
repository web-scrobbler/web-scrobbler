'use strict';

Connector.playerSelector = '.MuiList-root';
Connector.trackArtSelector = '.Mui-selected .MuiListItemAvatar-root .MuiAvatar-circle .MuiAvatar-img';

const trackSelector = '.Mui-selected .MuiListItemText-root .MuiListItemText-primary';

Connector.getArtistTrack = () => {
    let { artist, track } = Util.processYtVideoTitle($(trackSelector).text());

    // Set to some default information that we have (probably "Song Title Song Artist" with a space)
	// so that the user can edit the info in the extension
	if (!artist) {
		artist = Util.getTextFromSelectors(trackSelector);
	}
    if (!track) {
        track = Util.getTextFromSelectors(trackSelector);
    }

	return { artist, track };
};
