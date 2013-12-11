
// remember urls to detect ajax pageloads (using history API)
var lastUrl = '';


// we will observe changes at the main player element
// which changes (amongst others) on ajax navigation
var target = null;
var feather = false;
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        // detect first mutation that happens after url has changed
        if (lastUrl != location.href) {
            lastUrl = location.href;
            updateNowPlaying();
        }
    });
});


var config = { attributes: true };

target = document.querySelector('#player-api');
if (!target) {
    feather = true;
    updateNowPlaying();
}
else {
    observer.observe(target, config);
}
// bind page unload function to discard current "now listening"
$(window).unload(function() {

    // reset the background scrobbler song data
    chrome.runtime.sendMessage({type: 'reset'});

    return true;
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
   var separators = [' - ', ' – ', '-', '–', ':'];

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
   track = track.replace(/\(\s*\)/, ''); // Leftovers after e.g. (official video)
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

   // get the video ID
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

   // http://code.google.com/intl/cs/apis/youtube/2.0/developers_guide_protocol_video_entries.html
   var googleURL = "https://gdata.youtube.com/feeds/api/videos/" + videoID + "?alt=json";

   // Get clip info from youtube api
   chrome.runtime.sendMessage({type: "xhr", url: googleURL}, function(response) {
      var info = JSON.parse(response.text);
      var parsedInfo = parseInfo(info.entry.title.$t);
      var artist = null;
      var track = null;
      var artist_dom = '';
      var track_dom = '';
      if (!feather) {
        // Use the #eow-title #watch-headline-show-title if available
        track_dom = $('#eow-title').clone();
        artist_dom = $('#watch-headline-show-title', track_dom);
      }
      else {
        // Otherwise use h1#vt from the YouTube's Feather Layout
        track_dom = $('h1#vt').clone();
      }
      // there is a hyperlink of artist in title
      if (artist_dom.length) {
        var wholeTitleText = trim( track_dom.text() );
        artist = artist_dom.text();

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

      // just a plain text title
      else if (parsedInfo['artist'] == '') {
        parsedInfo = parseInfo(track_dom.text());
      }

      artist = parsedInfo['artist'];
      track = parsedInfo['track'];

      // get the duration from the YT API response
      var duration = '';
      if (info.entry.media$group.media$content != undefined)
         duration = info.entry.media$group.media$content[0].duration;
      else if (info.entry.media$group.yt$duration.seconds != undefined)
         duration = info.entry.media$group.yt$duration.seconds;

      // Validate given artist and track (even for empty strings)
      chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
         // on success send nowPlaying song
         if (response != false) {
            var song = response; // contains valid artist/track now
            // substitute the original duration with the duration of the video
            chrome.runtime.sendMessage({type: 'nowPlaying', artist: song.artist, track: song.track, duration: duration});
         }
         // on failure send nowPlaying 'unknown song'
         else {
            chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
         }
    });

   });

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
