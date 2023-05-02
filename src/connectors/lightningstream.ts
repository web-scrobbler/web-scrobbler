export {};

Connector.playerSelector = '#MainContainer';

Connector.trackSelector = '.SN_pw_slot.open .SN_pw_title';

Connector.artistSelector = '.SN_pw_slot.open .SN_pw_artist';

Connector.trackArtSelector = '.SN_pw_slot.open .SN_pw_cover';

Connector.isTrackArtDefault = (url) => url?.includes('noimage');

Connector.isPlaying = () => Util.isElementVisible('#playerStopLink');
