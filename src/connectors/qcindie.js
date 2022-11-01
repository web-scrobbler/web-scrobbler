'use strict';
// the artist and track info are inverted on this site, values for artist and track are intentionally flipped

Connector.playerSelector = '#content';
Connector.artistSelector = '#ReloadThis > div:first-of-type .trackinfo';
Connector.trackSelector = '#ReloadThis > div:first-of-type .artistinfo';
Connector.isPlaying = () => Util.isElementVisible('.lunaaudioplayer [id$=smallbuttonpause]');
