/**
 * Last.fm Scrobbler for Chrome
 * by David Sabata
 *
 * https://github.com/david-sabata/Chrome-Last.fm-Scrobbler
 *
 *
 * TODOs
 *
 * - add second validation to nowPlaying request handler or trust the data to be valid?
 *
 */


// browser tab with actually scrobbled track
var nowPlayingTab = null;

// song structure, filled in nowPlaying phase, (artist, track, duration, startTime)
var song = {};

// timer to submit the song
var scrobbleTimeout = null;

// is scrobbling disabled?
var disabled = false;

// set up page action handler; use dummy.html popup to override
chrome.pageAction.onClicked.addListener(pageActionClicked);


/**
 * Default settings & update notification
 */
{
   // use notifications by default
   if (localStorage.useNotifications == null)
      localStorage.useNotifications = 1;

   // now playing notifications
   if (localStorage.useNotificationsNowPlaying == null)
      localStorage.useNotificationsNowPlaying = 1;
   
   // scrobbled notifications
   if (localStorage.useNotificationsScrobbled == null)
      localStorage.useNotificationsScrobbled = 1;

   // no disabled connectors by default
   if (localStorage.disabledConnectors == null)
      localStorage.disabledConnectors = JSON.stringify([]);

   // hide notifications by default
   if (localStorage.autoHideNotifications == null)
      localStorage.autoHideNotifications = 1;

   // show update popup - based on different version
   if (localStorage.appVersion != chrome.app.getDetails().version) {
      localStorage.appVersion = chrome.app.getDetails().version;

      // introduce new options if not already set
      if (typeof localStorage.useAutocorrect == 'undefined')
         localStorage.useAutocorrect = 0;
   }
}


function reset() {
   console.log('reset called');
   if (scrobbleTimeout != null) {
      clearTimeout(scrobbleTimeout);
      scrobbleTimeout = null;
   }

   nowPlayingTab = null;
   song = {};
}



/**
 * Calculates MD5 hash of the API request
 * stored in k=v&k=v&... format
 * @param params object
 * @return md5 hash
 */
function apiCallSignature(params) {
   var keys = new Array();
   var o = '';

   for (var x in params)
      keys.push(x);

   // params has to be ordered alphabetically
   keys.sort();

   for (i = 0; i < keys.length; i++) {
      if (keys[i] == 'format' || keys[i] == 'callback')
         continue;

      o = o + keys[i] + params[keys[i]];
   }

   //console.log('hashing %s', o);

   // append secret
   return MD5(o + '2160733a567d4a1a69a73fad54c564b2');
}


/**
 * Creates query string from object properties
 */
function createQueryString(params) {
   var parts = new Array();

   for (var x in params)
      parts.push( x + '=' + encodeUtf8( params[x] ) );

   return parts.join('&');
}


/**
 * Encodes the utf8 string to use in parameter of API call
 */
function encodeUtf8(s) {
   return encodeURIComponent( s );
}

/**
 * Page action onclick handler. Switches scrobbling off and on
 * and calls setActionIcon to re-set the icon accordingly
 */
function pageActionClicked(tabObj) {
   // switch
   disabled = !disabled;

   // set up new icon
   if (disabled) {
      reset();
      setActionIcon(ACTION_DISABLED, tabObj.id);
   } else {
      setActionIcon(ACTION_REENABLED, tabObj.id);
   }
}


/**
 * Sets up page action icon, including title and popup
 * 
 * @param {integer} action one of the ACTION_ constants
 * @param {integer} tabId
 */
function setActionIcon(action, tabId) {

   var tab = tabId ? tabId : nowPlayingTab;
   chrome.pageAction.hide(tab);

   switch(action) {
      case ACTION_UNKNOWN:
         chrome.pageAction.setIcon({tabId: tab, path: ICON_UNKNOWN});
         chrome.pageAction.setTitle({tabId: tab, title: 'Song not recognized. Click the icon to correct its title'});
         chrome.pageAction.setPopup({tabId: tab, popup: 'popup.html'});
         break;
      case ACTION_NOWPLAYING:
         chrome.pageAction.setIcon({tabId: tab, path: ICON_NOTE});
         chrome.pageAction.setTitle({tabId: tab, title: 'Now playing: ' + song.artist + ' - ' + song.track + '\nClick to disable scrobbling'});
         chrome.pageAction.setPopup({tabId: tab, popup: ''});
         break;
      case ACTION_SCROBBLED:
         chrome.pageAction.setIcon({tabId: tab, path: ICON_TICK});
         chrome.pageAction.setTitle({tabId: tab, title: 'Song has been scrobbled\nClick to disable scrobbling'});
         chrome.pageAction.setPopup({tabId: tab, popup: ''});
         break;
      case ACTION_DISABLED:
         chrome.pageAction.setIcon({tabId: tab, path: ICON_NOTE_DISABLED});
         chrome.pageAction.setTitle({tabId: tab, title: 'Scrobbling is disabled\nClick to enable'});
         chrome.pageAction.setPopup({tabId: tab, popup: ''});
         break;
      case ACTION_REENABLED:
         chrome.pageAction.setIcon({tabId: tab, path: ICON_TICK_DISABLED});
         chrome.pageAction.setTitle({tabId: tab, title: 'Scrobbling will continue for the next song'});
         chrome.pageAction.setPopup({tabId: tab, popup: ''});
         break;
      case ACTION_CONN_DISABLED:
         chrome.pageAction.setIcon({tabId: tab, path: ICON_CONN_DISABLED});
         chrome.pageAction.setTitle({tabId: tab, title: 'Scrobbling for this site is disabled, most likely because the site has changed its layout. Please contact the connector author.'});
         chrome.pageAction.setPopup({tabId: tab, popup: ''});
         break;
      case ACTION_SITE_RECOGNIZED:
         chrome.pageAction.setIcon({tabId: tab, path: ICON_LOGO});
         chrome.pageAction.setTitle({tabId: tab, title: 'This site is supported for scrobbling'});
         chrome.pageAction.setPopup({tabId: tab, popup: ''});
         break;
      case ACTION_SITE_DISABLED:
         chrome.pageAction.setIcon({tabId: tab, path: ICON_LOGO});
         chrome.pageAction.setTitle({tabId: tab, title: 'This site is supported, but you disabled it'});
         chrome.pageAction.setPopup({tabId: tab, popup: ''});
         break;
   }

   chrome.pageAction.show(tab);
}


/**
 * Shows (or not) the notification, based on user settings
 * Use 'force' to override settings and always show the notification (e.g. for errors)
 */
function scrobblerNotification(text, force) {
   if (localStorage.useNotifications != 1 && !force)
      return;
   
   // Opera compatibility
   if (typeof(webkitNotification) === "undefined")
      return;

   var title = 'Last.fm Scrobbler';
   var body = '';
   var boom = text.split(NOTIFICATION_SEPARATOR);

   if (boom.length == 1)
      body = boom[0];
   else {
      title = boom[0];
      body = boom[1];
   }

   var notification = webkitNotifications.createNotification(
      'icon128.png',
      title,
      body
   );
   notification.show();

   if (localStorage.autoHideNotifications == 1)
      setTimeout(function() {notification.cancel()}, NOTIFICATION_TIMEOUT);
}


/**
 * Retrieves a token and opens a new window for user to authorize it
 */
function authorize() {
   var http_request = new XMLHttpRequest();
   http_request.open("GET", apiURL + 'method=auth.gettoken&api_key=' + apiKey, false); // synchronous
   http_request.setRequestHeader("Content-Type", "application/xml");
   http_request.send(null);

   console.log('getToken response: %s', http_request.responseText);

   var xmlDoc = $.parseXML(http_request.responseText);
   var xml = $(xmlDoc);
   var status = xml.find('lfm').attr('status');

   if (status != 'ok') {
      console.log('Error acquiring a token: %s', http_request.responseText);
      localStorage.token = '';
   } else {
      localStorage.token = xml.find('token').text();

      // open a tab with token authorization
      var url = 'https://www.last.fm/api/auth/?api_key=' + apiKey + '&token=' + localStorage.token;
      window.open(url);
   }
}

/**
 * Retrieve sessionID token if not already available
 * Returns false if the sessionID cannot be retrieved (try again later - user has to authorize)
 */
function getSessionID() {
   // check for a token first
   if (!localStorage.token || localStorage.token == '') {
      authorize();
      return false;
   }

   // do we already have a session?
   if (localStorage.sessionID && localStorage.sessionID != '')
      return localStorage.sessionID;

   var params = {
      method: 'auth.getsession',
      api_key: apiKey,
      token: localStorage.token
   };
   var api_sig = apiCallSignature(params);
   var url = apiURL + createQueryString(params) + '&api_sig=' + api_sig;

   var http_request = new XMLHttpRequest();
   http_request.open("GET", url, false); // synchronous
   http_request.setRequestHeader("Content-Type", "application/xml");
   http_request.send(null);

   console.log('getSession reponse: %s', http_request.responseText);

   var xmlDoc = $.parseXML(http_request.responseText);
   var xml = $(xmlDoc);
   var status = xml.find('lfm').attr('status');

   if (status != 'ok') {
      console.log('getSession: the token probably hasn\'t been authorized');
      localStorage.sessionID = '';
      authorize();
   } else {
      localStorage.sessionID = xml.find('key').text();
      return localStorage.sessionID;
   }

   return false;
}



/**
 * Validate song info against last.fm and return valid song structure
 * or false in case of failure
 * @return object/false
 */
function validate(artist, track) {
   var autocorrect = localStorage.useAutocorrect ? localStorage.useAutocorrect : 0;
   var validationURL = apiURL + "method=track.getinfo&api_key=" + apiKey + "&autocorrect="+ autocorrect +"&artist=" + encodeUtf8(artist) + "&track=" + encodeUtf8(track);
   console.log('validating %s - %s', artist, track);

   var req = new XMLHttpRequest();
   req.open('GET', validationURL, false);
   req.send(null);
   if(req.status == 200) {
      if (req.responseText != "You must supply either an artist and track name OR a musicbrainz id.") {
         // fill-in the song structure with validated data
         var xmlDoc = $.parseXML(req.responseText);
         var xml = $(xmlDoc);

         // return the valid song info
         return {artist : xml.find('artist > name').text(),
                  track : xml.find('track > name').text(),
                  duration : xml.find('track > duration').text()
                };
      } else {
         console.log('validation failed: %s', req.responseText);
      }
   }

   return false;
}



/**
 * Tell server which song is playing right now (won't be scrobbled yet!)
 */
function nowPlaying() {
   console.log('nowPlaying called for %s - %s', song.artist, song.track);
   if (disabled) {
      console.log('scrobbling disabled; exitting nowPlaying');
      return;
   }

   // if the token/session is not authorized, wait for a while
   var sessionID = getSessionID();
   if (sessionID === false)
      return;

   var params = {
      method: 'track.updatenowplaying',
      track: song.track,
      artist: song.artist,
      api_key: apiKey,
      sk: sessionID
   };

   var api_sig = apiCallSignature(params);
   var url = apiURL + createQueryString(params) + '&api_sig=' + api_sig;

   var notifText =  'Now playing' + NOTIFICATION_SEPARATOR + song.artist + " - " + song.track;

   var http_request = new XMLHttpRequest();
   http_request.open("POST", url, false); // synchronous
   http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   http_request.send(params);

   console.log('nowPlaying response: %s', http_request.responseText);

   var xmlDoc = $.parseXML(http_request.responseText);
   var xml = $(xmlDoc);

   if (xml.find('lfm').attr('status') == 'ok') {
         console.log('now playing %s - %s', song.artist, song.track);

         // Confirm the content_script, that the song is "now playing"
         chrome.tabs.sendMessage(nowPlayingTab, {type: "nowPlayingOK"});
         
         // Show notification
         if (localStorage.useNotificationsNowPlaying == 1)
            scrobblerNotification(notifText);
      
         // Update page action icon
         setActionIcon(ACTION_NOWPLAYING);
   } else {
      alert('Last.fm responded with unknown code on nowPlaying request');
   }
}




/**
 * Finally scrobble the song, but only if it has been playing long enough.
 * Cleans global variables "song", "playingTab" and "scrobbleTimeout" on success.
 */
function submit() {
   // bad function call
   if (song == null || !song || song.artist == '' || song.track == '' || typeof(song.artist) == "undefined" || typeof(song.track) == "undefined" ) {
      reset();
      chrome.tabs.sendMessage(nowPlayingTab, {type: "submitFAIL", reason: "No song"});
      return;
   }

   // if the token/session is not authorized, wait for a while
   var sessionID = getSessionID();
   if (sessionID === false)
      return;

   console.log('submit called for %s - %s', song.artist, song.track);

   var params = {
      method: 'track.scrobble',
      'timestamp[0]': song.startTime,
      'track[0]': song.track,
      'artist[0]': song.artist,
      api_key: apiKey,
      sk: sessionID
   };

   var api_sig = apiCallSignature(params);
   var url = apiURL + createQueryString(params) + '&api_sig=' + api_sig;

   var http_request = new XMLHttpRequest();
   http_request.open("POST", url, false); // synchronous
   http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   http_request.send(params);

   if (http_request.status == 200) {
      var notifText =  'Scrobbled' + NOTIFICATION_SEPARATOR + song.artist + " - " + song.track;

      // notification
      if (localStorage.useNotificationsScrobbled == 1)
         scrobblerNotification(notifText);

      // Update page action icon
      setActionIcon(ACTION_SCROBBLED);

      // stats
      _gaq.push(['_trackEvent', 'Track scrobbled']);

      console.log('submitted %s - %s (%s)', song.artist, song.track, http_request.responseText);

      // Confirm the content script, that the song has been scrobbled
      if (nowPlayingTab)
        chrome.tabs.sendMessage(nowPlayingTab, {type: "submitOK", song: {artist:song.artist, track: song.track}});

   }
   else if (http_request.status == 503) {
      console.log('submit failed %s - %s (%s)', song.artist, song.track, http_request.responseText);
      alert('Unable to scrobble the track. Last.fm server is temporarily unavailable.');
   }
   else {
      console.log('submit failed %s - %s (%s)', song.artist, song.track, http_request.responseText);
      alert('An error occured while scrobbling the track. Please try again later.');
   }

   // clear the structures awaiting the next song
   reset();
}



/**
 * Extension inferface for content_script
 * nowPlaying(artist, track, currentTime, duration) - send info to server which song is playing right now
 * xhr(url) - send XHR GET request and return response text
 * newSession() - start a new last.fm session (need to reauthenticate)
 * validate(artist, track) - validate artist-track pair against last.fm and return false or the valid song
 */
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
         switch(request.type) {

            // Called when a new song has started playing. If the artist/track is filled,
            // they have to be already validated! Otherwise they can be corrected from the popup.
            // Also sets up a timout to trigger the scrobbling procedure (when all data are valid)
   		case "nowPlaying":
                  console.log('nowPlaying requested');
                  console.log($.dump(request));

                  // do the reset to be sure there is no other timer running
                  reset();

                  // remember the caller
                  nowPlayingTab = sender.tab.id;

                  // scrobbling disabled?
                  if (disabled) {
                     setActionIcon(ACTION_DISABLED, nowPlayingTab);
                     break;
                  }

                  // backward compatibility for connectors which dont use currentTime
                  if (typeof(request.currentTime) == 'undefined')
                     request.currentTime = 0;

                  // data missing, save only startTime and show the unknown icon
                  if (typeof(request.artist) == 'undefined' || typeof(request.track) == 'undefined') {
                     // fill only the startTime, so the popup knows how to set up the timer
                     song = {
                        startTime : parseInt(new Date().getTime() / 1000.0) // in seconds
                     };

                     // if we know something...
                     if (typeof(request.artist) != 'undefined')
                        song.artist = request.artist;
                     if (typeof(request.track) != 'undefined')
                        song.track = request.track;
                     if (typeof(request.currentTime) != 'undefined')
                        song.currentTime = request.currentTime;
                     if (typeof(request.duration) != 'undefined')
                        song.duration = request.duration;

                     // Update page action icon to 'unknown'
                     setActionIcon(ACTION_UNKNOWN, sender.tab.id);
                  }
                  // all data are avaliable and valid, set up the timer
                  else {
                     // fill the new playing song
                     song = {
                        artist : request.artist,
                        track : request.track,
                        currentTime : request.currentTime,
                        duration : request.duration,
                        startTime : ( parseInt (new Date().getTime() / 1000.0) - request.currentTime) // in seconds
                     }

                     // make the connection to last.fm service to notify
                     nowPlaying();

                     // The minimum time is 240 seconds or half the
                     // track's total length. Subtract the song's
                     // current time (for the case of unpausing).
                     var min_time = (Math.max(1, Math.min(240, song.duration / 2) - song.currentTime));
                     // Set up the timer
                     scrobbleTimeout = setTimeout(submit, min_time * 1000);
                  }

      		sendResponse({});
      		break;

            // called when the window closes / unloads before the song can be scrobbled
            case "reset":
                  // TEMP
                  //delete localStorage.sessionID;
                  //delete localStorage.token;

                  reset();
                  sendResponse({});
                  break;

            case "trackStats":
      		_gaq.push(['_trackEvent', request.text]);
      		sendResponse({});
      		break;

            // returns the options in key => value pseudomap
            case "getOptions":
                  var opts = {};
      		for (var x in localStorage)
                     opts[x] = localStorage[x];
                  sendResponse({value: opts});
      		break;

            // do we need this anymore? (content script can use ajax)
            case "xhr":
      		var http_request = new XMLHttpRequest();
      		http_request.open("GET", request.url, true);
      		http_request.onreadystatechange = function() {
      			if (http_request.readyState == 4 && http_request.status == 200)
      				sendResponse({text: http_request.responseText});
      		};
      		http_request.send(null);
      		break;

            // for login
   		case "newSession":
      		sessionID = "";
      		break;

            // connector tells us it is disabled
   		case "reportDisabled":
      		setActionIcon(ACTION_CONN_DISABLED, sender.tab.id);
      		break;

            // Checks if the request.artist and request.track are valid and
            // returns false if not or a song structure otherwise (may contain autocorrected values)
      	case "validate":
                  console.log('validate requested');

                  var res = validate(request.artist, request.track);

                  // res is false or a valid song structure
                  sendResponse( res );
                  break;


            default:
                  console.log('Unknown request: %s', $.dump(request));
         }
         
         return true;
	}
);
