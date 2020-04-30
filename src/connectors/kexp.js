'use strict';

Connector.isPlaying = () => Util.hasElementClass('.Player', 'Player--playing');

Connector.playerSelector = '.Player';
Connector.artistTrackSelector = '.Player-title';
Connector.albumSelector = '.Player-album';
