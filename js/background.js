var curVer = '4.12';
if (localStorage.version === undefined) {
	chrome.tabs.create({url:"html/update.html"});
	localStorage.version = curVer;
	localStorage["SystemReset"] = "true";
} else if (localStorage.version !== curVer){
	console.log("updated to "+curVer);
	localStorage.version = curVer;
	chrome.tabs.create({url:"html/new_update.html"});
	localStorage["SystemReset"] = "true";
}

if (localStorage["SystemReset"]==undefined){
	localStorage["SystemReset"] = "true";
}

var notiNum = 0;
var review_link = "https://chrome.google.com/webstore/detail/pandora-enhancer/cfkpeohmdjckkiblfeplofpibkcajfbo/reviews";
var default_col = ["rgb(34, 64, 153)", "rgba(0, 173, 238, .5)","rgba(34, 64, 153, .5)","rgba(155, 0, 220, .92)","rgba(155, 0, 220, .92)","0.03"];

//First Time Setup:
var modelPreferences = ["4",true,false,false,true,true,true,false];
var pref = [];
var colors = [];

if (localStorage["PandoraDownloadOnClickk"]==undefined || localStorage["SystemReset"] == "true"){
	localStorage["PandoraDownloadOnClickk"] = "true";
}

if (localStorage["PandoraCustomColors"]==undefined || localStorage["SystemReset"] == "true"){
	colors = default_col.slice();
	localStorage["PandoraCustomColors"] = JSON.stringify(colors);
} else {
	colors = JSON.parse(localStorage["PandoraCustomColors"]);
}

if (localStorage["PandoraNEWPreferences"]==undefined || localStorage["SystemReset"] == "true"){
	pref = modelPreferences.slice();
	localStorage["PandoraNEWPreferences"] = JSON.stringify(pref);
} else {
	pref = JSON.parse(localStorage["PandoraNEWPreferences"]);
}

for (var i = 0; i<default_col.length; i++){
	if (colors[i]==undefined){
		colors[i] = default_col[i];
	}
}
localStorage["PandoraCustomColors"] = JSON.stringify(colors);

for (var i = 0; i<modelPreferences.length; i++){
	if (pref[i]==undefined){
		pref[i] = modelPreferences[i];
	}
}
localStorage["PandoraNEWPreferences"] = JSON.stringify(pref);

var modelADVPreferences = [false,false,"*s by *a.mp4"];
var ADVpref = [];
if (localStorage["PandoraAdvPreferences"]==undefined || localStorage["SystemReset"] == "true"){
	ADVpref = modelADVPreferences.slice();
	localStorage["PandoraAdvPreferences"] = JSON.stringify(ADVpref);
} else {
	ADVpref = JSON.parse(localStorage["PandoraAdvPreferences"]);
}

for (var i = 0; i<=modelADVPreferences.length; i++){
	if (ADVpref[i]==undefined){
		ADVpref[i] = modelADVPreferences[i];
	}
}
localStorage["SystemReset"] = "false";


reloadPandoraTabs();
function reloadPandoraTabs(){
	chrome.tabs.query({}, function (tabs){
		for (var i = 0; i < tabs.length; i++) {
			if (tabs[i].url.search("www.pandora.com/") > -1){
				chrome.tabs.reload(tabs[i].id);
			}
		}
	});
}

function openPandora(){
	var found = false;
	var tabId;
	chrome.tabs.query({}, function (tabs){
		for (var i = 0; i < tabs.length; i++) {
			if (tabs[i].url.search("www.pandora.com/") > -1){
				found = true;
				tabId = tabs[i].id;
			}
		}
		if (found == false){
			for (var i = 0; i < tabs.length; i++) {
				if (tabs[i].url.search("newtab") > -1 && tabs[i].url.search("chrome") > -1){
					found = true;
					tabId = tabs[i].id;
				}
			}
			if (found){
				chrome.tabs.update(tabId,{url:"http://www.pandora.com/",highlighted: true});
			} else {
				chrome.tabs.create({url:"http://www.pandora.com/"});
			}
		} else {
			chrome.tabs.update(tabId,{highlighted: true});
		}
	});
}

function changeSetting(which){
	pref = JSON.parse(localStorage["PandoraNEWPreferences"]);
	if (confirm("Changing this setting will reload the Pandora window, are you sure you want to change this setting now?")){
		pref[which] = !pref[which];
		localStorage["PandoraNEWPreferences"] = JSON.stringify(pref);
		reloadPandoraTabs();
	}
}

function inject_css(css_code){
	chrome.tabs.query({}, function (tabs){
		for (var i = 0; i < tabs.length; i++) {
			if (tabs[i].url.search("www.pandora.com/") > -1){
				chrome.tabs.executeScript(tabs[i].id,{code: css_code});
			}
		}
	});
}

function inject_background_image(){
	if (localStorage['showCustomBackground'] == "1" && localStorage['custom_backgorund'].length > 0){
		var css_injection = '$("body").css({"background": "linear-gradient(to right top, rgba(18, 142, 212, 0.568627) 0%, rgba(36, 156, 221, 0) 50%, rgba(70, 116, 235, 0.298039) 75%, rgba(24, 53, 211, 0.8) 100%), linear-gradient(to right bottom, rgba(13, 65, 175, 0.498039) 0%, rgba(19, 101, 193, 0.498039) 25%, rgba(94, 193, 255, 0.4) 53%, rgba(63, 175, 241, 0.6) 70%, rgb(88, 92, 252) 95%, rgb(108, 92, 251) 100%), url('+localStorage['custom_backgorund']+') no-repeat center center fixed", "background-size": "cover", "background-attachment": "fixed"});';
		inject_css(css_injection);
	} else {
    	var or_src = "http://www.pandora.com/static/valances/pandora/default/skin_background.jpg";
    	var original_css = '$("body").css({"background-image": "url(background_simple.jpg)", "background-repeat": "no-repeat", "background-position": "50% 50%", "background": "linear-gradient(to top right, rgba(18,142,212,0.57) 0%, rgba(36,156,221,0) 50%, rgba(70,116,235,0.3) 75%, rgba(24,53,211,0.8) 100%), linear-gradient(to bottom right, rgba(13,65,175,0.5) 0%, rgba(19,101,193,0.5) 25%, rgba(94,193,255,0.4) 53%, rgba(63,175,241,0.6) 70%, rgba(88,92,252,1) 95%, rgba(108,92,251,1) 100%), url('+or_src+') 50% 50% no-repeat", "background-size": "cover", "background-color": "#0E77CC", "background-attachment": "fixed"});';
		inject_css(original_css);
	}
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	if (request.method == "changeAdSettingConfirm"){
		changeSetting(5);
	} else if (request.method == "changeRUSettingConfirm"){
		changeSetting(6);
	} else if (request.method == "openDLPage"){
		var d = "/html/downloads.html";
		chrome.tabs.query({}, function (tabs){
			for (var i = 0; i < tabs.length; i++) {
				if (tabs[i].url.search(d) > -1){
					chrome.tabs.update(tabs[i].id,{highlighted: true});
					return false;
				}
			}
			chrome.tabs.create({url:"html/downloads.html"});
		});
	} else if (request.method == "openOptions"){
		var d = "/html/options.html";
		chrome.tabs.query({}, function (tabs){
			for (var i = 0; i < tabs.length; i++) {
				if (tabs[i].url.search(d) > -1){
					chrome.tabs.update(tabs[i].id,{highlighted: true});
					return false;
				}
			}
			chrome.tabs.create({url:"html/options.html"});
		});
	} else if (request.method == "getPandoraPreferences"){
		sendResponse({rep:localStorage['PandoraNEWPreferences']});
	} else if (request.method == "sendPandoraDetails"){
		pref = JSON.parse(localStorage["PandoraNEWPreferences"]);
		var details = JSON.parse(request.message);
		/* details: (image,title,msg,length) */
		var notifID = 'pandora'+notiNum;
		chrome.notifications.create(notifID,{   
    		type: 'basic',
    		iconUrl: details[0], 
    		title: details[1], 
   			message: details[2]
    	}, function(){});
		if (Number(details[3])>0){
			setTimeout(function (){ chrome.notifications.clear(notifID, function (){}); },Number(details[3]));
		} else {
			setTimeout(function (){ chrome.notifications.clear(notifID, function (){}); },Number(pref[0])*1000);
		}
    	notiNum++;
	} else if (request.method == "play_music" || request.method == "pause_music" || request.method == "skip_music" || request.method == "TU_music" || request.method == "TD_music"){
		console.log("tuner controls accessed");
		chrome.tabs.query({}, function(tabs){
			for (var i=0; i<tabs.length; ++i){
				if (tabs[i].url.indexOf("pandora.com")){
					chrome.tabs.sendMessage(tabs[i].id, {method: request.method}, function(response){
						sendResponse({response});
					});
				}
			}
		});
	} else if (request.method == "openPandora"){
		openPandora();
	} else if (request.method == "mainscript"){
		console.log(request.message);
	} else if (request.method == "mainStarted"){
		console.log("New pandora session");
		//inject_background_image();
		if (JSON.parse(localStorage["PandoraNEWPreferences"])[5]){
			chrome.tabs.query({}, function (tabs){
				for (var i = 0; i < tabs.length; i++) {
					if (tabs[i].url.search("www.pandora.com/") > -1){
						chrome.tabs.executeScript(tabs[i].id,{file: "js/ad/blockads.js"});
						chrome.tabs.sendMessage(tabs[i].id, {method: "active_tab", data: tabs[i].id});
						console.log('%cAd-block script injected', 'color: green; font-weight: bold;');
					}
				}
			});
		}
		if (JSON.parse(localStorage["PandoraNEWPreferences"])[6]){
			chrome.tabs.query({}, function (tabs){
				for (var i = 0; i < tabs.length; i++) {
					if (tabs[i].url.search("www.pandora.com/") > -1){
						chrome.tabs.executeScript(tabs[i].id,{file: "js/stillListening.js"});
						console.log('%c"Are You Still Listening" script injected', 'color: green; font-weight: bold;');
					}
				}
			});
		}
	} else if (request.method == "change_background"){
		inject_background_image();
	} else if (request.method == "getColorPref"){
		console.log("color req");
		if (JSON.parse(localStorage["PandoraNEWPreferences"])[7]){
			sendResponse({rep: localStorage['PandoraCustomColors']});
		} else {
			sendResponse({ rep: "na" });
		}
	} else if (request.method == "popup_color_picker"){
		chrome.tabs.create({
            url: chrome.extension.getURL('html/colorPicker.html'),
            active: false
        }, function(tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true,
                width: 360,
                height: 452
                // incognito, top, left, ...
            });
        });
	}
});