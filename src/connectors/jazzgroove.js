'use strict';

Connector.playerSelector = '.jg-player';

Connector.artistSelector = ['.jg-song .MuiTypography-body2', '.jg-song .MuiTypography-caption'];

Connector.trackSelector = ['.jg-song .MuiTypography-h6', '.jg-song .MuiTypography-body1'];

Connector.trackArtSelector = '.jg-song .jg-player__album-art__image';

Connector.isPlaying = () => !Util.hasElementClass(Connector.playerSelector, 'jg-player--paused');

Connector.isScrobblingAllowed = () => {
	// station bumpers and other messages play with default images
	const defaultImages = ['Mix1', 'Mix2', 'Dreams', 'Gems', 'Smooth'];
	return !defaultImages.some((image) => Connector.getTrackArt().includes(`${image}.jpg`));
};
