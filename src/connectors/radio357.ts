'use strict';

Connector.playerSelector = '#web_player';

Connector.artistTrackSelector = '#web_player .r357p_song';

Connector.isPlaying = () => Util.hasElementClass('#web_player', 'playing');

Connector.isScrobblingAllowed = () => !Connector.getArtistTrack().artist.includes('Radio 357');
