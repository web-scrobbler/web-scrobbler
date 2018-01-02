'use strict';

Connector.playerSelector = '.player-container';

Connector.trackSelector = '.player-container > div.play-author > div > div.label-play-author > p.author.ng-binding';

Connector.artistSelector = '.player-container > div.play-author > div > div.label-play-author > p.label-m.ng-binding';

Connector.isPlaying = () => {
	return ($('.player-container > div.play-author > a > div > svg.icon.icon-play').css('display') === 'none');
};
