export {};

Connector.playerSelector = ['.np__player_widget', '.np__player_card'];

Connector.artistSelector = ['.np__artist_name', '.np__player_artist'];

Connector.trackSelector = ['.np__song_title', '.np__player_song'];

Connector.trackArtSelector = [
	'.np__avatar_element_image',
	'.np__player_card_img img',
];

Connector.isTrackArtDefault = (url) => {
	return Boolean(
		url?.includes('/show/images/') ||
			url?.includes('/player/') ||
			url?.match(/\/artists\/(?!station\/)/),
	);
};

Connector.isPodcast = () =>
	Connector.getTrack()?.match(/^Program(a)?\s\d+/) !== null;

Connector.isPlaying = () => {
	const onAirSelector = '.np__equalizer';
	// only livestream has artist and track info; check for on air / al aire indicator
	return (
		Util.isElementVisible(onAirSelector) &&
		!Util.hasElementClass(onAirSelector, 'np__equalizer__stop') &&
		Util.hasElementClass(
			'.np__btn_controls_play .np__btn_controls_icon',
			'fa-pause',
		)
	);
};
