'use strict';

/**
 * This connector supports Bandcamp embedded player.
 * Currently used for Bandcamp Daily.
 */

Connector.playerSelector = '#player';

Connector.artistSelector = '#artist';

Connector.trackSelector = '.currenttrack .tracktitle';

Connector.albumSelector = '#album';

Connector.currentTimeSelector = '.currenttrack .currenttime';

Connector.durationSelector = '.currenttrack .tracktime';

Connector.trackArtSelector = '.art';

Connector.isPlaying = () => $('#player').hasClass('playing');
