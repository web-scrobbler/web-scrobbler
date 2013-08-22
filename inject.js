/**
 * All connectors are defined here, instead of manifest.
 * 
 * Matching connector is injected to the page after document_end event.
 * 
 * Do not include jQuery - it is included by default.
 * 
 * 
 * Supported fields:
 * 
 *    label 
 *          - label to be shown in options to enable/disable the connector
 *          - be careful with renaming, as connector disable state depends on the label
 *          
 *    matches 
 *          - array of positive matches in format described in Chrome Ext. Dev. guide
 *          - connectors are processed in order and the first match is used; you can use 
 *            this behaviour to emulate exclude matches
 *            
 *    js 
 *          - array of paths of files to be executed 
 *          - all executions happen on or after 'document_end'    
 *          
 *    allFrames (optional)
 *          - boolean value representing InjectDetails.allFrames
 *          - FALSE by default
 *    
 */
var connectors = [
   
   {
      label: "YouTube",
      matches: ["*://www.youtube.com/watch*", "*://www.youtube.com/user/*"],
      js: ["connectors/youtube.js"]
   },
   
   {
      label: "TTNET Müzik",
      matches: ["*://www.ttnetmuzik.com.tr/*"],
      js: ["connectors/ttnet.js"]
   },
   
   {
      label: "Thesixtyone",
      matches: ["*://www.thesixtyone.com/*"],
      js: ["connectors/61.js"]
   },
   
   {
      label: "Google Play Music",
      matches: ["*://play.google.com/music/*"],
      js: ["connectors/googlemusic.js"]
   },
   
   {
      label: "MySpace",
      matches: ["*://myspace.com/*"],
      js: ["connectors/myspace.js"]
   },
   
   {
      label: "Pitchfork",
      matches: ["*://pitchfork.com/*", "*://www.pitchfork.com/*"],
      js: ["connectors/pitchfork.js"]
   },
   
   {
      label: "Fizy",
      matches: ["*://fizy.com/*", "*://fizy.org/*"],
      js: ["connectors/fizy.js"]
   },
   
   {
      label: "Virgin Radio Turkiye",
      matches: ["*://*.virginradioturkiye.com/*", "*://*.radioeksen.com/*"],
      js: ["connectors/virginradiotr.js"]
   },
   
   {
      label: "Ghostly Discovery",
      matches: ["http://ghostly.com/discovery/play"],
      js: ["connectors/ghostly.js"]
   },
   
   {
      label: "Bandcamp",
      matches: ["*://*.bandcamp.com/*"],
      js: ["connectors/bandcamp.js"]
   },
   
   {
      label: "Google Plus YT player",
      matches: ["*://plus.google.com/*youtube/player"],
      js: ["connectors/google+.js"]
   },
   
   {
      label: "Jango",
      matches: ["*://www.jango.com/*"],
      js: ["connectors/jango.js", "connectors/jango-dom-inject.js"]
   },
   
   {
      label: "Pandora",
      matches: ["*://www.pandora.com/*"],
      js: ["connectors/pandora.js"]
   },
   
   {
      label: "Deezer",
      matches: ["*://www.deezer.com/*"],
      js: ["connectors/deezer.js"]
   },
   
   {
      label: "SoundCloud",
      matches: ["*://soundcloud.com/*"],
      js: ["connectors/soundcloud.js"]
   },
   
   {
      label: "Amazon",
      matches: ["*://www.amazon.com/gp/dmusic/mp3/player*", "*://www.amazon.de/gp/dmusic/mp3/player*", "*://www.amazon.es/gp/dmusic/mp3/player*"],
      js: ["connectors/amazon.js"]
   },
   
   { // DEAD?
      label: "Z-Music",
      matches: ["*://z-music.org/*"],
      js: ["connectors/zmusic.js"]
   },
   
   {
      label: "VK",
      matches: ["*://vk.com/*"],
      js: ["connectors/vk.js"]
   },
   
   {
      label: "Zvooq",
      matches: ["*://zvooq.ru/*"],
      js: ["connectors/zvooq.js"]
   },
   
   {
      label: "Weborama",
      matches: ["*://www.weborama.fm/*"],      
      js: ["connectors/weborama.js"],
      allFrames: true
   },

   {
      label: "22 Tracks",     
      matches: ["*://22tracks.com/*"],
      js: ["connectors/22tracks.js"]
   },
   
   {
      label: "Megalyrics",
      matches: ["*://megalyrics.ru/*"],      
      js: ["connectors/megalyrics.js"],
      allFrames: true
   },
   
   {
      label: "iHeart",
      matches: ["*://*.iheart.com/*"],
      js: ["connectors/iheart.js"]
   },
   
   {
      label: "Indie Shuffle",
      matches: ["*://www.indieshuffle.com/*"],
      js: ["connectors/indieshuffle.js"]
   },
   
   {
      label: "Tuba.FM",
      matches: ["*://fm.tuba.pl/*"],
      js: ["connectors/tubafm.js"]
   },
   
   {
      label: "Spotify",
      matches: ["https://play.spotify.com/*"],
      js: ["connectors/spotify.js"]
   },
   
   {
      label: "Grooveshark",
      matches: ["*://grooveshark.com/*"],
      js: ["connectors/grooveshark.js"]
   },
   
   {
      label: "Plug.dj",
      matches: ["http://plug.dj/*"],
      js: ["connectors/plugdj.js"]
   },
   
   {
      label: "Turntable",
      matches: ["*://turntable.fm/*"],
      js: ["connectors/turntable.js"]
   },
   
   {
      label: "Slacker (iframe)",
      matches: ["*://www.slacker.com/webplayer/index_embed.vm"],
      js: ["connectors/slacker.js"]
   },
   
   {
      label: "Slacker (main page)",
      matches: ["*://www.slacker.com/*"],
      js: ["connectors/slacker2.js"]
   }   
   
];






/**
 * Creates regex from single match pattern
 * 
 * @author lacivert
 * @param {String} input
 * @returns RegExp
 */
function createPattern(input) {
    if (typeof input !== 'string') return null;
    var match_pattern = '^'
      , regEscape = function(s) {return s.replace(/[[^$.|?*+(){}\\]/g, '\\$&');}
      , result = /^(\*|https?|file|ftp|chrome-extension):\/\//.exec(input);

    // Parse scheme
    if (!result) return null;
    input = input.substr(result[0].length);
    match_pattern += result[1] === '*' ? 'https?://' : result[1] + '://';

    // Parse host if scheme is not `file`
    if (result[1] !== 'file') {
        if (!(result = /^(?:\*|(\*\.)?([^\/*]+))/.exec(input))) return null;
        input = input.substr(result[0].length);
        if (result[0] === '*') {    // host is '*'
            match_pattern += '[^/]+';
        } else {
            if (result[1]) {         // Subdomain wildcard exists
                match_pattern += '(?:[^/]+\.)?';
            }
            // Append host (escape special regex characters)
            match_pattern += regEscape(result[2]);// + '/';
        }
    }
    // Add remainder (path)
    match_pattern += input.split('*').map(regEscape).join('.*');
    match_pattern += '$';
    
    return new RegExp(match_pattern);
}


/**
 * @param {String} label
 * @returns boolean
 */
function isConnectorEnabled(label) {
   var disabledArray = JSON.parse(localStorage.disabledConnectors);
   return (disabledArray.indexOf(label) === -1);
}



/**
 * Injects connectors to tabs upon page loading
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   // wait for the Loaded event
   if (changeInfo.status !== 'complete')
      return;
   
   // run first available connector
   var anyMatch = !connectors.every(function(connector) {
      var matchOk = false;
      
      connector.matches.forEach(function(match) {
         matchOk = matchOk || createPattern(match).test(tab.url);
      });

      if (matchOk === true) {
         console.log('connector ' + connector.label + ' matched for ' + tab.url);
         setActionIcon(ACTION_SITE_RECOGNIZED, tabId);
         
         if (isConnectorEnabled(connector.label)) {
            // inject all scripts and jQuery, use slice to avoid mutating
            var scripts = connector.js.slice(0);
            scripts.unshift(JQUERY_PATH);
            
            scripts.forEach(function(jsFile){
               var injectDetails = {
                  file: jsFile,
                  allFrames: connector.allFrames ? connector.allFrames : false
               };
               chrome.tabs.executeScript(tabId, injectDetails);
            });
         } else {
            setActionIcon(ACTION_SITE_DISABLED, tabId);
         }
      }
      
      return !matchOk;
   });
   
   // hide page action if there is no match
   if (!anyMatch) {
      chrome.pageAction.hide(tabId);
   }
});
