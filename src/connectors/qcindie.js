'use strict';

Connector.playerSelector = '#content';
Connector.artistSelector = '.p3-artistInfo';
Connector.trackSelector = '.p3-title';
Connector.isPlaying = () => Util.hasElementClass('#ppBtn', 'playing');
