/**
 * Last.fm Scrobbler for Chrome - Digitally Imported connector
 * @author Daniel Lo Nigro - http://dan.cx/
 *
 * This script runs in the context of di.fm itself. It listens for events fired
 * by their JavaScript, and propagates these events to the extension via
 * `postMessage`.
 */

(function() {
  $(document).on('metadata-track', function(evt, metadata) {
    window.postMessage({
      type: 'DI_TRACK_CHANGE',
      metadata: metadata
    }, '*');
  });

  $(document).on('wp-stop', function(evt) {
    window.postMessage({
      type: 'DI_STOP'
    }, '*');
  });
}());
