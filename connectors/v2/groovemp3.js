'use strict';

/* global Connector */

Connector.artistSelector = '.current-track .artist';
Connector.trackSelector = '.current-track .track-name';
Connector.trackArtImageSelector = '.current-track img';

Connector.playerSelector = '#player-controls';
Connector.currentTimeSelector = '.elapsed-time';
Connector.durationSelector = '.track-length';
Connector.playButtonSelector = '.icon-play.toggle-play';

Connector.getArtist = function () {
			var text = $(this.artistSelector).first().clone().children().remove().end().text();
			return text || null;
		};

Connector.getUniqueID = function () {
			var ID = JSON.parse(localStorage.getItem('last-track')).value.id.toString();
			return ID || null;
		};
