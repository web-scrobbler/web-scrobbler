'use strict';

/* global Connector */

// Full player container (bar at the bottom)	: [data-testid]="player"#player	.player__playerContainer___JEJ2U
//   'Currently playing' container          	: #nowPlayingContainer         	.player__nowPlayingContainer___2FBjw

Connector.playerSelector = '.player__playerContainer___JEJ2U';
// Connector.playerSelector = '[data-testid]="player"'; // Alternative with div id. Not working due to data class, div id #player is another element

// Connector.artistTrackSelector = '.nowPlaying__title___2No7P'; //'Artist - Title' format, hence can't use artist/trackSelector
Connector.artistTrackSelector = '#playerTitle';	// Alternative with div ids instead of classes

// Connector.trackArtSelector = '.nowPlaying__artworkImage___2N-EA';
Connector.trackArtSelector = '#playerArtwork'; //Alternative with div ids instead of classes

Connector.isPlaying = function () {
	return $('#playerActionButton').hasClass('playing');
};
