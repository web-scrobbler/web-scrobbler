'use strict';

Connector.playerSelector = '#player_container';

Connector.playButtonSelector = '#control_playpause';

Connector.isPlaying = () => $('#control_playpause').hasClass('playing');

Connector.getArtist = () => 'Phish';

Connector.trackSelector = '#player_title';

Connector.albumSelector = '#player_detail';
