export {};

Connector.playerSelector = 'div.layoutnowonair_reload_active';

Connector.artistSelector = 'div.teasertext > h3 > a > span.manualteasertitle';

Connector.trackSelector = 'div.teasertext > h3 > h3 > span.manualteasertitle';

Connector.isPlaying = () => Util.hasElementClass('.player', 'player_playing');
