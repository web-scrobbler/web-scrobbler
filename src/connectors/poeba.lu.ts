export {};

/**
 * This connector supports poeba.lu music review site.
 * Reads metadata from the album info section and floating player.
 */

Connector.playerSelector = '#floating-player-dock';

Connector.artistSelector = '.album-meta dd:nth-child(2)';

Connector.albumSelector = '.album-meta dd:nth-child(4)';

Connector.getArtistTrack = () => {
  const artist = document.querySelector('.album-meta dd:nth-child(2)')?.textContent?.trim() || null;
  const album = document.querySelector('.album-meta dd:nth-child(4)')?.textContent?.trim() || null;

  return { artist, track: album };
};

Connector.isPlaying = () => {
  const dock = document.querySelector('#floating-player-dock');
  const title = document.querySelector('#floating-player-dock-title');

  return Boolean(dock && title && title.textContent?.trim().length > 0);
};
