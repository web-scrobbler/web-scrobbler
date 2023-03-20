'use strict';

Connector.playerSelector = '.jg-player';

Connector.artistSelector = ['.jg-song .MuiTypography-body2', '.jg-song .MuiTypography-caption'];

Connector.trackSelector = ['.jg-song .MuiTypography-h6', '.jg-song .MuiTypography-body1'];

Connector.trackArtSelector = '.jg-song .jg-player__album-art__image';

Connector.isTrackArtDefault = () => {
	const defaultImages = ['Mix1', 'Mix2', 'Dreams', 'Gems', 'Smooth'];
	return defaultImages.some((image) => Connector.getTrackArt().includes(`${image}.jpg`));
};

// station bumpers and other spoken messages play with default images
Connector.isScrobblingAllowed = () => !Connector.isTrackArtDefault();

Connector.isPlaying = () => !Util.hasElementClass(Connector.playerSelector, 'jg-player--paused');
