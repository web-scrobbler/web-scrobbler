'use strict';
Connector.playerSelector = '#app';
Connector.trackSelector = '.music-player_metaInner_Va844 .title';
Connector.artistSelector = '.music-player_metaInner_Va844 .artist';
Connector.trackArtSelector = 'img._base-resource-image_image_3p9XJ';
Connector.isPlaying = () => Util.getAttrFromSelectors('div.music-player_play_2rjtB > svg > use', 'xlink\:href') === '#icon-pause';
