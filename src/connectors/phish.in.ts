'use strict';

Connector.playerSelector = '#player_container';

Connector.playButtonSelector = '#control_playpause';

Connector.isPlaying = () =>
	Util.hasElementClass('#control_playpause', 'playing');

Connector.getArtist = () => 'Phish';

Connector.trackSelector = '#player_title';

Connector.albumSelector = '#player_detail';
