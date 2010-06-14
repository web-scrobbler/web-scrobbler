function saveOptions() {	
	localStorage.username = document.getElementById("username").value;
	localStorage.password = MD5(document.getElementById("password").value);
	chrome.extension.sendRequest({type: "newSession"});
	
	//Update status box in options page to let user know their username and pass has been taken.
	updateStatus("Will now scrobble using "+localStorage.username+".");
	return false;
}

function deleteOptions() {
	localStorage.clear();
	chrome.extension.sendRequest({type: "newSession"});
	
	updateStatus("Account deleted.");
}


function updateStatus(msg) {
	// Updates the status box
	document.getElementById("status").style.display="block";
	document.getElementById("status").innerHTML=msg;
}

function getCurrentUser() {
	if (localStorage.username != null) {
		updateStatus('Using '+localStorage.username+' to scrobble.')
	}
}
