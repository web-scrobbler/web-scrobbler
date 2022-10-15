'use strict';

Connector.playerSelector = '.np__player_widget';

Connector.artistTrackSelector = '.np__info_principal';

Connector.trackArtSelector = '.np__avatar_element_image';

Connector.isTrackArtDefault = (url) => url.includes('/show/images/');

Connector.isPlaying = () => Util.hasElementClass('.np__btn_controls_play .np__btn_controls_icon', 'fa-pause');

Connector.isScrobblingAllowed = () => {
	return (
		// only livestream provides artist and track info; check for on air/al aire indicator
		Util.isElementVisible('.np__equalizer') &&
		!Util.hasElementClass('.np__equalizer', 'np__equalizer__stop')
	);
};

Connector.isStateChangeAllowed = () => {
	return Connector.getArtistTrack() && Util.isElementVisible(Connector.artistTrackSelector);
};
