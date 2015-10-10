var lastTrack;

// care - minus vs hyphen
var separators = [' - ', ' – ', '-', '–', ':'];

$(function() {
  $('.track-title').bind('DOMSubtreeModified', function() {
    updateNowPlaying();
  });

  $(window).unload(function() {
    chrome.runtime.sendMessage({type: 'reset'});
    return true;
  });
});


/**
 * Find first occurence of possible separator in given string
 * and return separator's position and size in chars or null
 */
function findSeparator(str, separators) {
  for (i in separators) {
    var sep = separators[i];
    var index = str.indexOf(sep);
    if (index > -1)
      return { index: index, length: sep.length };
  }

  return null;
}

/**
 * Parse given string into artist and track, assume common order Art - Ttl
 * @return {artist, track}
 */
function parseInfo(artistTitle) {
  if (artistTitle) {
    var separator = findSeparator(artistTitle, separators);
    if (separator == null)
      return { artist: '', track: '' };

    var artist = artistTitle.substr(0, separator.index);
    var track = artistTitle.substr(separator.index + separator.length);

    return cleanArtistTrack(artist, track);
  }
}


/**
 * Clean non-informative garbage from title
 */
function cleanArtistTrack(artist, track) {

  // Do some cleanup
  artist = artist.replace(/^\s+|\s+$/g,'');
  track = track.replace(/^\s+|\s+$/g,'');

  return {artist: artist, track: track};
}


function parseDurationString(timestr) {
  if (timestr) {
    var m = /((\d+):)?(\d+):(\d+)/.exec(timestr);
    var duration = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
    if (undefined != m[2]) {
      duration += parseInt(m[3], 10) * 60 * 60;
    }
    return duration;
  }
  return 0;
}

function parseDurationStringByTimeCode(timeCode) {
	if (timeCode) {
		var separator = findSeparator(timeCode, [' / ']);
		if (separator == null)
			return 0;

		var durationString = timeCode.substr(separator.index + separator.length);

		return parseDurationString(durationString);
	}
}

function updateNowPlaying() {
  var trackInfo = $(".track-name").attr("title");
  if ('' == trackInfo) return;

  var timeCode = $(".progress").find('.timecode').text();
  var duration = parseDurationStringByTimeCode(timeCode);

  var parsedInfo = parseInfo(trackInfo);
  if (parsedInfo) {
    var artist = parsedInfo['artist'];
    var title = parsedInfo['track'];

    if (lastTrack != artist + " " + title) {
      lastTrack = artist + " " + title;

      chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title}, function(response) {
        if (response != false) {
          chrome.runtime.sendMessage({
            type: 'nowPlaying',
            artist: response.artist,
            track: response.track,
            duration: duration
          });
        } else {
          chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
        }
      });
    }
  }


}


/**
 * Listen for requests from scrobbler.js
 */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.type) {

      // background calls this to see if the script is already injected
      case 'ping':
        sendResponse(true);
        break;
    }
  }
);

