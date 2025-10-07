export {};

Connector.playerSelector = 'ol';

Connector.isPlaying = () => {
  const btn = document.querySelector('[data-testid="play_pause_button"]');
  return btn?.getAttribute('aria-label')?.toUpperCase() === 'PAUSE';
};

Connector.scrobblingDisallowedReason = () => {
  const activeTrack = Array.from(document.querySelectorAll('ol li')).find((li) => 
    li.textContent?.toLowerCase().includes('now playing')
  );
  return activeTrack ? null : 'Other';
};

Connector.getArtistTrack = () => {
  const activeTrack = Array.from(document.querySelectorAll('ol li')).find((li) => 
    li.textContent?.toLowerCase().includes('now playing')
  );

  if (!activeTrack) return null;

  const artistEls = activeTrack.querySelectorAll('.sw-text-secondary');
  const artist = artistEls[artistEls.length - 1]?.textContent?.trim();
  
  const trackElement = activeTrack.querySelector('.sw-text-minion')?.parentElement;
  const track = trackElement?.textContent?.replace(/now\s*playing/gi, '').trim();
  
  return artist && track ? { artist, track } : null;
};

Connector.getTrackArt = () => {
  const activeTrack = Array.from(document.querySelectorAll('ol li')).find((li) => 
    li.textContent?.toLowerCase().includes('now playing')
  );
  return activeTrack?.querySelector('img')?.src || null;
};
