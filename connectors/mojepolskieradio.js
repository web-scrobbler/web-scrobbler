/*
 * Chrome-Last.fm-Scrobbler Moje Polskie Radio connector: http://moje.polskieradio.pl
 * 2013 Arkadiusz Kuryłowicz <arkadiusz@kurylowicz.info>
 *
 */

$(function() {
  $(window).unload(function() {
    chrome.runtime.sendMessage({type: 'reset'});
    return true;
  });

  var func_get_artist_album = function() {
    var a = $("#EventDetails1_lblArtist").text().toLowerCase().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    return {artist: a, track: $("#EventDetails1_lblTitle").text()};
  };

  var func_get_time = function() {
    var m = /(\d+).?(\d+)/.exec($("#EventDetails1_lblRuntime").text());
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  };

  var func_scrobble = function() 
  {
    var current = func_get_artist_album();
    var last = sessionStorage.getItem('mpr_last_scrobbled');
    if (last) {
      last = JSON.parse(last);
      if (last.artist == current.artist && last.track == current.track) {
        console.log("MPR: page reload, not scrobbling");
        return;
      } 
    }
    sessionStorage.setItem('mpr_last_scrobbled', JSON.stringify(current));

    chrome.runtime.sendMessage($.extend(current, {type: 'validate'}), function(response) {
      if (response != false) {
        console.log("MPR: submited " + response.artist + " '" + response.track + "'");
        chrome.runtime.sendMessage({type: 'nowPlaying', artist: response.artist, track: response.track, duration: func_get_time()});
      }
      else {
        chrome.runtime.sendMessage({type: 'nowPlaying', duration: func_get_time()});
      }
    });
  };

  console.log("MPR: starting");

  // Observe track changes
  var observer = new MutationObserver(function(mutations) { func_scrobble() });
  observer.observe(document.querySelector("#contentContainer"), {childList: true, subtree: true, attributes: true});

  // Scrobble current track as well
  func_scrobble();
});
