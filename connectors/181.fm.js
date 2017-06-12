'use strict';

/**
 * This connector is for 181fm.mystreamplayer.com website.
 * 181.fm contains `iframe` element, and this makes the scrobbling
 * from this website impossible.
 */

/* global Connector */

const DEFAULT_TRACK_ART = 'configs/images/noalbum-white.png';

Connector.playerSelector = '.player';

Connector.artistSelector = '#artist';

Connector.trackSelector = '#song';

Connector.trackArtSelector = '.songimg';

Connector.isTrackArtDefault = (trackArtUrl) => {
	return trackArtUrl.endsWith(DEFAULT_TRACK_ART);
};

Connector.isPlaying = () => $('#playbtn').hasClass('jp-stopx');
