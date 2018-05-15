console.log("Ad-Block Started");
// BLOCK PANDORA FROM MAKING ANY AD REQUESTS

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	if (request.method == "active_tab"){
		chrome.webRequest.onBeforeRequest.addListener(function(info){
			//console.log("prevent.js", info.url);
			if ( !(JSON.parse(localStorage["PandoraNEWPreferences"])[5]) ){
				return {cancel:false};
			}
			var url = info.url;
			if (url.match(/mediaserverPublicRedirect|googlesyndication|adroll|radioAdEmbedGPT|tritondigital|adclick|doubleclick/i) != null){
				console.log("%cBlocked Ad: " + url, 'color: red; font-weight: bold;');
				return {cancel:true};
			} else if (url.indexOf("pandora.js") > -1){
				//var new_url = chrome.extension.getURL("js/pandora.js");
				//return {redirectUrl: new_url};
			}

			return {cancel:false};
		},
		{
			urls: ["<all_urls>"],
			tabId: request.data
		},
		["blocking"]);
	}
});

/*chrome.webRequest.onBeforeRequest.addListener(function(info){
	//console.log(info.url);
	if ( !(JSON.parse(localStorage["PandoraNEWPreferences"])[5]) ){
		return {cancel:false};
	}
	var url = info.url;
	if (url.match(/mediaserverPublicRedirect|googlesyndication|adroll|radioAdEmbedGPT|tritondigital|adclick|doubleclick/i) != null){
		console.log("%cBlocked Ad: " + url, 'color: red; font-weight: bold;');
		return {cancel:true};
	} else if (url.indexOf("pandora.js") > -1){
		//var new_url = chrome.extension.getURL("js/pandora.js");
		//return {redirectUrl: new_url};
	}

	return {cancel:false};
},
{
	urls: ["*://*.pandora.com/*"],
	urls: ["<all_urls>"],
	tabId: tabID;
	types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
},
["blocking"]);*/

/*

https://tpc.googlesyndication.com/safeframe/1-0-6/html/container.html
https://s.adroll.com/j/roundtrip.js
https://www.pandora.com/web-client/radioAdEmbedGPT.html?cb=14894426979052026
https://lt500.tritondigital.com/lt?sid=9718&vid=8B2E1B4CE279E69564430549D26…56&yob=1996&gender=M&zip=14580&hasads=1&devcat=WEB&devtype=WEB&cb=58045304
http://adclick.g.doubleclick.net/pcs/click%253Fxai%253DAKAOjsuW-Z2_f85s-zkI…waZTf_hlEyT-tD4wvj50XuuLJYvJ6mBTLtyxOeS1N61c8PlrPvyrjnwLW5gOArhQHGh-jD21QI
https://securepubads.g.doubleclick.net/pcs/view?xai=AKAOjsuM4PTwVLPbN7EE5Hf…x7ZxNzO0jDI6QeXofN3ql-0k7kVhOc&sig=Cg0ArKJSzGyNifAZhqSIEAE&urlfix=1&adurl=
/util/mediaserverPublicRedirect.jsp?at=BIwJk3KFE1%2FLVO9HNktcsFWfkPxhZ%2FFUE4L6WENb2W4OdUNfywnxI4cA%3D%3D&ct=v210343050yrbvi&type=audio:1

*/
