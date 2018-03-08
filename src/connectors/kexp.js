'use strict';

Connector.isPlaying = () => $( '.Player--streamPlaying' ).hasClass( 'Player--playing' );

Connector.playerSelector = '.Player-meta';
Connector.artistTrackSelector = '.Player-title';
Connector.albumSelector = '.Player-album';
