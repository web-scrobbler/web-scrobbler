var MUSIC_CATEGORY_ID = "10";

// google api v3 requires you to register your app and generate a key which is limited by request quota by the way :'(
var API_KEY = "AIzaSyAaWFGiIhchQl7Up23HFmJON_mIVjDURHg";

// remember urls to detect ajax pageloads (using history API)
var lastUrl = '';

// options flag to scrobble only tracks from Music category;
// loaded asynchronously from storage; default to false for backwards compatibility
var scrobbleMusicOnly = false;

function handleMutation (mutation) {
	// detect first mutation that happens after url has changed
	if (lastUrl != location.href) {
		lastUrl = location.href;
		updateNowPlaying();
	}
}

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(handleMutation);
});

var config = {
	attributes: true,
	attributeFilter: ['data-youtube-id', 'src']
};

var target = document.querySelector('#player-api video');

handleMutation(null);
observer.observe(target, config);

// bind page unload function to discard current "now listening"
$(window).unload(function() {

    // reset the background scrobbler song data
    chrome.runtime.sendMessage({type: 'reset'});

    return true;
});

// load options
chrome.storage.local.get('Connectors', function(data) {
	if (data && data['Connectors'] && data['Connectors']['YouTube']) {
		var options = data['Connectors']['YouTube'];
		if (options.scrobbleMusicOnly) {
			scrobbleMusicOnly = true;
		}

		console.log('connector options: ' + JSON.stringify(options));
	}
});

/**
 * Trim whitespaces from both endings of the string
 */
function trim(str) {
   return str.replace(/^\s+|\s+$/g, '');
}

/**
 * Find first occurence of possible separator in given string
 * and return separator's position and size in chars or null
 */
function findSeparator(str) {
   // care - minus vs hyphen
   var separators = [' - ', ' – ', '-', '–', ':', '|', '///'];

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
   var artist = '';
   var track = '';

   var separator = findSeparator(artistTitle);
   if (separator == null)
      return { artist: '', track: '' };

   artist = artistTitle.substr(0, separator.index);
   track = artistTitle.substr(separator.index + separator.length);

   return cleanArtistTrack(artist, track);
}

/**
 * Parse given duration string in 'PT<hours>H<minutes>M<seconds>S format
 * @return integer duration in seconds
 */
function parseDurationISO8601(durationString) {
  var match = durationString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  var hours = (parseInt(match[1]) || 0);
  var minutes = (parseInt(match[2]) || 0);
  var seconds = (parseInt(match[3]) || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Parse given duration string in '<hours>:<minutes>:<seconds>' format
 * @return integer duration in seconds
 */
function parseDurationColon(durationString) {
  var parts = durationString.split(':');
  parts = new Array(4 - parts.length).join('0').split('').concat(parts);
  return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
}

/**
 * Clean non-informative garbage from title
 */
function cleanArtistTrack(artist, track) {

   // Do some cleanup
   artist = artist.replace(/^\s+|\s+$/g,'');
   track = track.replace(/^\s+|\s+$/g,'');

   // Strip crap
   track = track.replace(/\s*\*+\s?\S+\s?\*+$/, ''); // **NEW**
   track = track.replace(/\s*\[[^\]]+\]$/, ''); // [whatever]
   track = track.replace(/\s*\([^\)]*version\)$/i, ''); // (whatever version)
   track = track.replace(/\s*\.(avi|wmv|mpg|mpeg|flv)$/i, ''); // video extensions
   track = track.replace(/\s*(LYRIC VIDEO\s*)?(lyric video\s*)/i, ''); // (LYRIC VIDEO)
   track = track.replace(/\s*(Official Track Stream*)/i, ''); // (Official Track Stream)
   track = track.replace(/\s*(of+icial\s*)?(music\s*)?video/i, ''); // (official)? (music)? video
   track = track.replace(/\s*(of+icial\s*)?(music\s*)?audio/i, ''); // (official)? (music)? audio
   track = track.replace(/\s*(ALBUM TRACK\s*)?(album track\s*)/i, ''); // (ALBUM TRACK)
   track = track.replace(/\s*(COVER ART\s*)?(Cover Art\s*)/i, ''); // (Cover Art)
   track = track.replace(/\s*\(\s*of+icial\s*\)/i, ''); // (official)
   track = track.replace(/\s*\(\s*[0-9]{4}\s*\)/i, ''); // (1999)
   track = track.replace(/\s+\(\s*(HD|HQ)\s*\)$/, ''); // HD (HQ)
   track = track.replace(/\s+(HD|HQ)\s*$/, ''); // HD (HQ)
   track = track.replace(/\s*video\s*clip/i, ''); // video clip
   track = track.replace(/\s+\(?live\)?$/i, ''); // live
   track = track.replace(/\(+\s*\)+/, ''); // Leftovers after e.g. (official video)
   track = track.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // Artist - The new "Track title" featuring someone
   track = track.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // 'Track title'
   track = track.replace(/^[\/\s,:;~-\s"]+/, ''); // trim starting white chars and dash
   track = track.replace(/[\/\s,:;~-\s"\s!]+$/, ''); // trim trailing white chars and dash
   //" and ! added because some track names end as {"Some Track" Official Music Video!} and it becomes {"Some Track"!} example: http://www.youtube.com/watch?v=xj_mHi7zeRQ

   return {artist: artist, track: track};
}

/**
 * Called every time the player reloads
 */
function updateNowPlaying() {
  var videoID = document.URL.match(/v[^a-z]([a-zA-Z0-9\-_]{11})/);

  if (videoID && videoID.length > 0)
    videoID = videoID[1];
  else
    videoID = null;

  // videoID from title at profile page
  if ($('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]').length > 0) {
    videoID = $('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]').attr('onclick').toString().match(/\?v=(.{11})/);
    if (videoID && videoID.length > 0)
      videoID = videoID[1];
  }
  // videoID from title at profile page - newer version
  if ($('#playnav-curvideo-title > a').length > 0) {
    videoID = $('#playnav-curvideo-title > a').attr('href').toString().match(/\?v=(.{11})/);
    if (videoID && videoID.length > 0)
      videoID = videoID[1];
  }

  // something changed?
  if (!videoID) {
    console.log('If there is a YouTube player on this page, it has not been recognized. Please fill in an issue at GitHub');
    //alert('YouTube has probably changed its code. Please get newer version of the Last.fm Scrobbler extension');
    return;
  }

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) {
      return;
    }

    var info = null;

    if (xhr.status == 200) {
      info = JSON.parse(xhr.responseText).items[0];
      if (scrobbleMusicOnly && info.snippet.categoryId != MUSIC_CATEGORY_ID) {
        console.log('Skipping track because it is not in Music category');
        return;
      }
    }

    var parsedInfo = parseInfo(info ? info.snippet.title : '');
    var track_dom = $('#eow-title').clone();
    var artist_dom = $('#watch-headline-show-title', track_dom);
    var track = null;
    var artist = null;

    if (artist_dom.length) {
      artist = artist_dom.text();

      var wholeTitleText = trim(track_dom.text());
      var artistIndex = wholeTitleText.indexOf(artist);
      var separator = findSeparator(wholeTitleText);

      // no separator found, assume rest of the title is track name
      if (separator == null) {
        track = wholeTitleText.replace(artist, '');
      }
      // separator AFTER artist, common order, cut after separator
      else if (separator.index > artistIndex) {
        track = wholeTitleText.substr(separator.index + separator.length);
      }
      // separator BEFORE artist, reversed order, cut before separator
      else {
        track = wholeTitleText.substr(0, separator.index);
      }

      parsedInfo = cleanArtistTrack(artist, track);
    }
    else if (parsedInfo['artist'] == '') {
      parsedInfo = parseInfo(track_dom.text());
    }

    artist = parsedInfo['artist'];
    track = parsedInfo['track'];

    var duration_dom = $('.ytp-time-duration').first();
    var duration = info
      ? parseDurationISO8601(info.contentDetails.duration)
      : parseDurationColon(duration_dom.text());

    // Validate given artist and track (even for empty strings)
    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
      // on success send nowPlaying song
      if (response != false) {
        var song = response; // contains valid artist/track now
        // substitute the original duration with the duration of the video
        chrome.runtime.sendMessage({type: 'nowPlaying', artist: song.artist, track: song.track, duration: duration, source: 'YouTube', sourceId: videoID});
      }
      // on failure send nowPlaying 'unknown song'
      else {
        chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration, source: 'YouTube', sourceId: videoID});
      }
    });
  };

  var googleURL = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=' + videoID + '&key=' + API_KEY;
  xhr.open('GET', googleURL, true);
  xhr.send();
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
