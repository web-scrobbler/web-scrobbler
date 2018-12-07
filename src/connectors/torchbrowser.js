'use strict';

Connector.playerSelector = '#td_player';

Connector.artistSelector = '#player_links .artist';

Connector.trackSelector = '#player_title';

Connector.albumSelector = '#player_links .album';

Connector.timeInfoSelector = '#div_time';

Connector.trackArtSelector = '#player_thumb img';

Connector.isPlaying = () => $('.player_btn.pause').length > 0;

Connector.isTrackArtDefault = (url) => url.includes('noimage');
