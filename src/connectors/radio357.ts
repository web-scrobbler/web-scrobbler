export {};

Connector.playerSelector = '#web_player';

Connector.artistTrackSelector = '#web_player .r357p_song';

Connector.isPlaying = () => Util.hasElementClass('#web_player', 'playing');

Connector.scrobblingDisallowedReason = () =>
	Connector.getArtistTrack()?.artist?.includes('Radio 357')
		? 'FilteredTag'
		: null;
