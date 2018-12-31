'use strict';

Connector.playerSelector = '.td-player-bar';

Connector.artistSelector = '#td-player-bar__nowplaying__trackinfo__artist-name';

Connector.trackSelector = '#td-player-bar__nowplaying__trackinfo__cue-title';

Connector.playButtonSelector = 'button.fa-play';

Connector.trackArtSelector = '.td-player-bar img.tdcoverart';

Connector.isScrobblingAllowed = () => {
	return Connector.getTrack() !== 'In Commercial Break' || Connector.getArtist !== '';
};

Connector.isTrackArtDefault = (url) => url.includes('default-cover-art') || url.includes('957ThatStation');

Connector.getUniqueID = () => {
	let match = /\?i=(\d+)/gi.exec($('.td-player-bar__buy a').attr('href'));
	return match && match[1] || null;
};
