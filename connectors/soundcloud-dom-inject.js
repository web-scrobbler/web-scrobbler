/**
 * Last.fm Scrobbler for Chrome - Soundcloud connector
 * @author Jeppe Hasseriis - https://github.com/cenobitedk
 *
 * This script runs in the context of soundcloud itself. 
 * It listens to the page event bus, and propagates these 
 * events to the extension via 'postMessage'.
 */

(function() {
  if ('event_bus' in window) {}
  else {
    require(['event-bus'], function(bus) {
      window.event_bus = bus;
      bus.off('audio:play').on('audio:play', function(e) {
        window.postMessage({
          type: 'SC_PLAY',
          metadata: e.sound.attributes
        }, '*');
      });
      bus.off('audio:pause').on('audio:pause', function(e) {
        window.postMessage({
          type: 'SC_PAUSE',
          metadata: e.sound.attributes
        }, '*');
      });
    });
  }
}());
