export {};

/**
 * Connector for Rádio Outra Hora (https://radio.outrahora.com).
 *
 * The site is a static SPA that exposes a single primary player
 * (`#playerView`) on both the home page and the TV layout. Track info
 * is updated in place by `player.js` / `tv.js` and the extension
 * already fills `navigator.mediaSession` via `media-session.js`, so
 * we delegate metadata extraction to the MediaSession API and only
 * need to point the connector at the player container and artwork
 * element.
 *
 * The TV page (`/tv`) and the embed widget (`embed/outrahora-bar.js`)
 * also use the same `#currentTitle` / `#currentArtist` / `#coverArtwork`
 * / `#audio` selectors in their own DOM, so this connector covers all
 * of them once the URL matches.
 *
 * `#playButton` is never hidden or removed while playing (it just
 * swaps its icon), so playback state is read from the `<audio>`
 * element instead, like other connectors do.
 */

Connector.playerSelector = '#playerView';

Connector.artistSelector = '#currentArtist';
Connector.trackSelector = '#currentTitle';

Connector.trackArtSelector = '#coverArtwork';

Connector.isPlaying = () => !document.querySelector('audio')?.paused;

Connector.useMediaSessionApi();
