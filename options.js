// credentials -----------------------------------------------------------------
function saveCredentials() {	
	localStorage.username = document.getElementById("username").value;
	localStorage.password = MD5(document.getElementById("password").value);
	chrome.extension.sendRequest({type: "newSession"});
	
	//Update status box in options page to let user know their username and pass has been taken.
	updateCredentialsStatus("Will now scrobble using "+localStorage.username+".");
	return false;
}

function deleteCredentials() {
	delete localStorage.username;
      delete localStorage.password;
	chrome.extension.sendRequest({type: "newSession"});
	
	updateCredentialsStatus("Account deleted.");
}


function updateCredentialsStatus(msg) {
	// Updates the status box
	document.getElementById("cred-status").style.display="block";
	document.getElementById("cred-status").innerHTML=msg;
}

function getCurrentUser() {
	if (localStorage.username != null) {
		updateCredentialsStatus('Using '+localStorage.username+' to scrobble.')
	}
}



// options ---------------------------------------------------------------------
$(function(){
   
   // use immediate-change checkboxes
   
   $('#use-notifications').click(function(){
      localStorage['useNotifications'] = this.checked ? 1 : 0;
   });
   
   $('#use-youtube-inpage').click(function(){
      localStorage['useYTInpage'] = this.checked ? 1 : 0;
   });
      
   // preload options
   $('#use-notifications').attr('checked', (localStorage['useNotifications'] == 1));   
   $('#use-youtube-inpage').attr('checked', (localStorage['useYTInpage'] == 1));
      
});
