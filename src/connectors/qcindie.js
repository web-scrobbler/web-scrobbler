'use strict';
// the artist and track info are inverted on this site, values for artist and track are intentionally flipped

Connector.playerSelector = '#content.site-content';
Connector.trackSelector = '#ReloadThis .col-sm-6:first-child p.artistinfo';
Connector.artistSelector = '#ReloadThis .col-sm-6:first-child p.trackinfo';
Connector.isPlaying = () => $('#wp1598381648smallbuttonplay').css('display') === 'none';