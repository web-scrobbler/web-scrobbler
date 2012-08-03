/**
 * I do nothing.
 * 
 * I am here to be active on all websites, so once the users confirm 
 * extension's permissions, they don't have to re-confirm on every update
 * that adds a new website connector.
 */
function isInteger(s) {
  return (s.toString().search(/^-?[0-9]+$/) == 0);
}

// Bandcamp on custom domains support
meta = document.getElementsByTagName("meta");
for(k in meta){
	if(isInteger(k)){
		tag = meta[k];
		if(tag.getAttribute("property") == "og:url" && tag.getAttribute("content").indexOf("bandcamp.com") != -1){
			console.log("Detected Bandcamp custom domain");
			chrome.extension.sendRequest({type: 'inject', file : 'bandcamp.js'});
		}
	}
}
