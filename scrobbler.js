/**
 * TODOs
 * 
 * - add second validation to nowPlaying request handler or trust the data to be valid?
 *
 */

const APP_NAME = "Chrome Last.fm Scrobbler";
const APP_VERSION = "0.7";

// timeout in ms for ajax requests
const AJAX_TIMEOUT = 5000;

// authentication token retrieved after handshake()
var sessionID = "";

// number of failed authentications after the last successful one
var authFailCounter = 0;

// browser tab with actually scrobbled track
var nowPlayingTab = null;

// "now playing" and "scrobble" urls retrieved in handshake()
var nowPlayingURL = "http://post.audioscrobbler.com:80/np_1.2";
var submissionURL =  "http://post2.audioscrobbler.com:80/protocol_1.2";

// api url
var apiURL = "http://ws.audioscrobbler.com/2.0/?";


// song structure, filled in nowPlaying phase, (artist, track, duration, startTime)
var song = {};

// timer to submit the song
var scrobbleTimeout = null;


/**
 * Notification
 */
const NOTIFICATION_TIMEOUT = 5000;
const NOTIFICATION_SEPARATOR = ':::';

/**
 * Page action icons
 */
const ICON_UNKNOWN = 'icon_unknown.png';  // not recognized
const ICON_NOTE = 'icon_note.png';        // now playing
const ICON_TICK = 'icon_tick.png';        // scrobbled

/**
 * Icon - title - popup set identificators
 */
const ACTION_UNKNOWN = 1;
const ACTION_NOWPLAYING = 2;
const ACTION_SCROBBLED = 3;
const ACTION_UPDATED = 4;

/**
 * Default settings & update notification
 */
{
   // use notifications by default
   if(localStorage.useNotifications == null)
      localStorage.useNotifications = 1;
   
   // don't use the YT statuses by default
   if (localStorage.useYTInpage == null)
      localStorage.useYTInpage = 0;
   
   // show update popup - based on different version
   if (localStorage.appVersion != APP_VERSION) {
      alert('updated!');
      //localStorage.appVersion = APP_VERSION;
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
 * Sets up page action icon, including title and popup
 * 'action' is one of the ACTION_ constants
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
         chrome.pageAction.setTitle({tabId: tab, title: 'Now playing: ' + song.artist + ' - ' + song.track});
         chrome.pageAction.setPopup({tabId: tab, popup: ''});
         break;
      case ACTION_SCROBBLED:
         chrome.pageAction.setIcon({tabId: tab, path: ICON_TICK});
         chrome.pageAction.setTitle({tabId: tab, title: 'Song has been scrobbled'});
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
   setTimeout(function() {notification.cancel()}, NOTIFICATION_TIMEOUT);
}


/**
 * Log in, retrieve sessionID
 */ 
function handshake() {
	var username = localStorage.username;
	var password = localStorage.password;

      // check for empty username/password
      if (!username || !password) {
         alert('Oops! Seems like you forgot to fill in your Last.fm credentials.\n\nPlease head to the options page and do so.');
         authFailCounter++;
      }

	var currentTime = parseInt(new Date().getTime() / 1000.0);
	var token = MD5(password + currentTime);
	var http_request = new XMLHttpRequest();
	http_request.onreadystatechange = function() {
		if (http_request.readyState == 4 && http_request.status == 200) {
			switch (http_request.responseText.split("\n")[0]) {
                     case 'OK':
                        sessionID = http_request.responseText.split("\n")[1];
                        nowPlayingURL = http_request.responseText.split("\n")[2];
                        submissionURL = http_request.responseText.split("\n")[3];
                        authFailCounter = 0;
                        break;
                     case 'BADAUTH':
                        authFailCounter++;
                        alert('Authentication failed!\n\nPlease check your username and password in options');
                        break;
                     default:
                        authFailCounter++;
                        alert('Last.fm auth server responded with error:\n' + http_request.responseText.split("\n")[0]);
                        break;
                  }

                  
		}
	}
	http_request.open(
		"GET",
		"http://post.audioscrobbler.com/?hs=true&p=1.2.1&c=chr&v=" + APP_VERSION + "&u=" + username + "&t=" + currentTime + "&a=" + token,
		false);
	http_request.setRequestHeader("Content-Type", "application/xml");
	http_request.send(null);
}



/**
 * Validate song info against last.fm and return valid song structure 
 * or false in case of failure
 * @return object/false
 */  
function validate(artist, track) {
   var validationURL = "http://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=d9bb1870d3269646f740544d9def2c95&autocorrect=1&artist=" + encodeURIComponent(artist) + "&track=" + encodeURIComponent(track);
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

   if (sessionID == '') 
      handshake();

   var params = "s=" + sessionID + "&a=" + song.artist + "&t=" + song.track;

   // these song params may not be set, but all query params has to be passed (even as null)
   params += "&l[0]=" + (typeof(song.duration) != "undefined" ? song.duration : "");
   params += "&b[0]=" + (typeof(song.album) != "undefined" ? song.album : "");
   params += "&m=&n=";
   
   var notifText =  'Now playing' + NOTIFICATION_SEPARATOR + song.artist + " - " + song.track;
   var ajaxTimeout = null; // timeout object

   var http_request = new XMLHttpRequest();
   http_request.onreadystatechange = function() {
         if (http_request.readyState == 4 && http_request.status == 200)
            // need to (re)authenticate
            if (http_request.responseText.split("\n")[0] == "BADSESSION") {
               // prevent looping on constantly failing auth
               if (authFailCounter == 0) {
                  handshake();
                  nowPlaying();
               }
               return;
            }
            else if (http_request.responseText.split("\n")[0] == "OK") {
                  console.log('now playing %s - %s, (%s)', song.artist, song.track, http_request.responseText);
               
                  // Confirm the content_script, that the song is "now playing"
                  chrome.tabs.sendRequest(nowPlayingTab, {type: "nowPlayingOK"});
                  // Show notification
                  scrobblerNotification(notifText);
                  // Update page action icon
                  setActionIcon(ACTION_NOWPLAYING);
            } else {
               alert('Last.fm responded with unknown code on nowPlaying request');
            }
            
            clearTimeout(ajaxTimeout);
   };
   http_request.open("POST", nowPlayingURL, false); // synchronous
   http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   http_request.send(params);
   
   /*
   // timeout
   ajaxTimeout = setTimeout(function(){
      http_request.abort();
      scrobblerNotification("Unable to connect to Last.fm service. Please check your connection", true);
   }, AJAX_TIMEOUT);      
   */
}




/**
 * Finally scrobble the song, but only if it has been playing long enough.
 * Cleans global variables "song", "playingTab" and "scrobbleTimeout" on success. 
 */ 
function submit() {
   // bad function call
   if (song == null || !song || song.artist == '' || song.track == '') {
      reset();
      chrome.tabs.sendRequest(nowPlayingTab, {type: "submitFAIL", reason: "No song"});      
      return;
   }

   // need to (re)authenticate?
   if (sessionID == "") {
      handshake();
   }
   
   console.log('submit called for %s - %s', song.artist, song.track);

   //var time = parseInt(new Date().getTime() / 1000.0);
   //var playTime = time - song.startTime;

   // the timeout is managed by background script and will not trigger until the minimum time has past
   //if (playTime >= 30 && (typeof(song.duration) == "undefined" || playTime >= Math.min(240, song.duration / 2))) {
      
      var params = "s=" + sessionID + "&a[0]=" + song.artist + "&t[0]=" + song.track + "&i[0]=" + song.startTime + "&o[0]=P";

      // these song params may not be set, but all query params has to be passed (even as null)
      params += "&l[0]=" + (typeof(song.duration) != "undefined" ? song.duration : "");
      params += "&b[0]=" + (typeof(song.album) != "undefined" ? song.album : "");
      params += "&r[0]=&m[0]=&n[0]=";

      var notifText =  'Scrobbled' + NOTIFICATION_SEPARATOR + song.artist + " - " + song.track;

      var http_request = new XMLHttpRequest();

      http_request.onreadystatechange = function() {               
         if (http_request.readyState == 4 && http_request.status == 200) {            
            // need to (re)authenticate
            if (http_request.responseText.split("\n")[0] == "BADSESSION") {
               handshake();
               submit();
            } else if (http_request.responseText.split("\n")[0] == "FAILED") {
               console.log('submit failed %s - %s (%s)', song.artist, song.track, http_request.responseText);
               alert(http_request.responseText);
            } else {
               // notification
               scrobblerNotification(notifText);

               // Update page action icon
               setActionIcon(ACTION_SCROBBLED);

               // stats
               _gaq.push(['_trackEvent', 'Track scrobbled']);

               console.log('submitted %s - %s (%s)', song.artist, song.track, http_request.responseText);

               // Confirm the content script, that the song has been scrobbled
               if (nowPlayingTab)
                  chrome.tabs.sendRequest(nowPlayingTab, {type: "submitOK"});
            }
         }
      };
      http_request.open("POST", submissionURL, false); // synchronous call!
      http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      http_request.send(params);

      // clear the structures awaiting the next song
      reset();
   
   // }
   
}



/**
 * Extension inferface for content_script
 * nowPlaying(artist, track, duration) - send info to server which song is playing right now
 * xhr(url) - send XHR GET request and return response text
 * newSession() - start a new last.fm session (need to reauthenticate)
 * validate(artist, track) - validate artist-track pair against last.fm and return false or the valid song     
 */  
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {            
         switch(request.type) {
               
            // Called when a new song has started playing. If the artist/track is filled,
            // they have to be already validated! Otherwise they can be corrected from the popup.
            // Also sets up a timout to trigger the scrobbling procedure (when all data are valid)
   		case "nowPlaying":
                  console.log('nowPlaying requested');
      		// remember the caller
                  nowPlayingTab = sender.tab.id;

                  console.log($.dump(request));

                  // data missing, save only startTime and show the unknown icon
                  if (typeof(request.artist) == 'undefined' || typeof(request.track) == 'undefined') {
                     // fill only the startTime, so the popup knows how to set up the timer
                     song = {
                        startTime : parseInt(new Date().getTime() / 1000.0) // in seconds; needed in popup for timer
                     };        
                     
                     // if we know something...
                     if (typeof(request.artist) != 'undefined')
                        song.artist = request.artist;
                     if (typeof(request.track) != 'undefined')
                        song.track = request.track;
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
                        /* album : request.album, */
                        duration : request.duration
                        /* startTime : parseInt(new Date().getTime() / 1000.0) */
                     }   

                     // make the connection to last.fm service to notify
                     nowPlaying();

                     // The minimum time is 240 seconds or half the track's total length
                     var min_time = Math.min(240, song.duration / 2); 
                     // Set up the timer
                     scrobbleTimeout = setTimeout(submit, min_time * 1000); 
                  }
                  
      		sendResponse({});                  
      		break;                  
                  
            // called when the window closes / unloads before the song can be scrobbled
            case "reset":
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
	}
);
