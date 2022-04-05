'use strict';

Connector.playerSelector = '.duration-1000';

Connector.trackSelector = '.text-current > h2';

Connector.getTrackInfo = () => {
    const artistAlbum = Util.getTextFromSelectors('.text-current > p');
    return Util.splitArtistAlbum(artistAlbum, [' - '], { swap: true });
};

Connector.trackArtSelector = '.duration-1000 .max-w-112 > img';

Connector.playButtonSelector = '.duration-1000 button[aria-label=Play]';

Connector.durationSelector = '.duration-1000 .rounded-md.border-gray-400 button > span > span:nth-of-type(3) > span';
