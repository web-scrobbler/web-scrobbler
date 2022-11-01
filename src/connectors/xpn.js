'use strict';

Connector.playerSelector = '.sgplayer';
Connector.trackSelector = '.sg-content-info .sg-title';
Connector.artistSelector = '.sg-content-info .sg-artist';
Connector.trackArtSelector = '#art';
Connector.isPlaying = () => Util.getAttrFromSelectors('.sg-control-play a', 'title') === 'Pause';
