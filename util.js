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
   track = track.replace(/\s*(of+icial\s*)?(music\s*)?video/i, ''); // (official)? (music)? video
   track = track.replace(/\s*\(\s*of+icial\s*\)/i, ''); // (official)
   track = track.replace(/\s*\(\s*[0-9]{4}\s*\)/i, ''); // (1999)
   track = track.replace(/\s+\(\s*(HD|HQ)\s*\)$/, ''); // HD (HQ)
   track = track.replace(/\s+(HD|HQ)\s*$/, ''); // HD (HQ)
   track = track.replace(/\s*video\s*clip/i, ''); // video clip
   track = track.replace(/\s+\(?live\)?$/i, ''); // live
   track = track.replace(/\(\s*\)/, ''); // Leftovers after e.g. (official video)
   track = track.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // Artist - The new "Track title" featuring someone
   track = track.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // 'Track title'
   track = track.replace(/^[\/\s,:;~-]+/, ''); // trim starting white chars and dash
   track = track.replace(/[\/\s,:;~-]+$/, ''); // trim trailing white chars and dash

   return {artist: artist, track: track};
}

