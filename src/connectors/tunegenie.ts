export {};

Connector.playerSelector = '#back_matte';
Connector.trackSelector = 'ul.currentonair li.slot:first-child .song';
Connector.artistSelector =
	'.currentonair > li.slot:first-child .left div:not(.song)';
Connector.trackArtSelector = '.currentonair > li.slot:first-child .disc img';
Connector.isPlaying = () => Util.hasElementClass('.play.btn i', 'icon-stop');
