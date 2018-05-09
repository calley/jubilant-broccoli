var logoLink = chrome.extension.getURL("photos/facenoti.png");
var clean = [["&amp;","&"]];
var no_Artwork = "http://www.pandora.com/img/no_album_art.png";

var lastSong = "";
var lastArtist = "";
var lastAlbum = "";
var lastImg = "";

var preferences = ["4",true,false,false,false,true];

function cleanString(str){
	var cleand = String(str);
	for (var i = 0; i < clean.length; i++){
		while ((cleand.indexOf(clean[i][0])) !== -1){
			cleand = cleand.replace(clean[i][0],clean[i][1]);
		}
	}
	return cleand;
}

function sendConsoleMessage(m){
	chrome.runtime.sendMessage({method: 'mainscript', message: m}, function(response){} );
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { 
	if (request.action == 'settingsChangedReq'){
		getPreferences();
	} else if (request.method == "pause_music"){
		if ($(".playButton").css("display") == "none"){
			document.getElementsByClassName("pauseButton")[0].click();
		}
	} else if (request.method == "play_music"){
		if ($(".playButton").css("display") !== "none"){
			document.getElementsByClassName("playButton")[0].click();
		}
	} else if (request.method == "skip_music"){
		document.getElementsByClassName("skipButton")[0].click();
	} else if (request.method == "TU_music"){
		document.getElementsByClassName("thumbUpButton")[0].click();
	} else if (request.method == "TD_music"){
		document.getElementsByClassName("thumbDownButton")[0].click();
	} else if (request.method == "currentSong"){
		if (lastSong !== "" && lastArtist !== ""){
			sendResponse({data: (lastSong+" by "+lastArtist), status: ($(".playButton").css("display") == "none"), thumbU: (!!document.getElementsByClassName("thumbUpButton indicator")[0]), thumbD: (!!document.getElementsByClassName("thumbDownButton indicator")[0]) });
		}
	} else if (request.method == "time_info"){
		sendResponse({rem: (document.getElementsByClassName("remainingTime")[0].innerHTML), elt: (document.getElementsByClassName("elapsedTime")[0].innerHTML)});
	}
});

function cutString(str,big){
	var shortnd = String(str);
	if (big){
		if (shortnd.length > 27){
			shortnd = (shortnd.slice(0,26))+"...";
		}
	} else {
		if (shortnd.length > 32){
			shortnd = (shortnd.slice(0,31))+"...";
		}
	}
	return shortnd;
}

function tabTitle(txt){ document.title = txt; }

function checkIfSkipped(done){
	if (!!(document.getElementsByClassName("toastItemText")[0])){
		if (document.getElementsByClassName("toastItemText")[0].innerHTML.indexOf("force us to limit")!== -1){
			if (done){
				createNoti(logoLink," ","You have run out of skips.",4000);
			} else {
				setTimeout(function (){ checkIfSkipped(true); },750);
			}
		} else if (!done){ setTimeout(function (){ checkIfSkipped(true); },750); }
	} else if (!done){ setTimeout(function (){ checkIfSkipped(true); },750); }
}

function createNoti(image,title,msg,length){
	chrome.extension.sendRequest({method: "noti", image: image, title: title, msg: msg, length:length});
}

function getPreferences(){
	chrome.runtime.sendMessage({method: 'getPandoraPreferences'},
		function(response){
			preferences = JSON.parse(response.rep);
		}
	);
}

function newSong(img,checkSong,artist,album){
	getPreferences();
	lastSong = checkSong;
	lastArtist = artist;
	var mess = cutString(cleanString("by "+artist),false)+"\n"+cutString(cleanString("on "+album),false);
	chrome.extension.sendRequest({method: "NewSong", data: (checkSong+" by "+artist), album: album, artist: artist, image: img, name: checkSong});
}

document.addEventListener("DOMSubtreeModified", function(e) {
	if (e.target.className.match(/remainingTime|elapsedTime/i) == null){
		if (e.target.className.match(/albumArt/i) != null){
			run(false);
		}
	}
}, false);

function run(again){
	if (!(document.getElementsByClassName("playerBarArt")[0])){
		setTimeout(function (){ run(again); }, 200);
	} else {
		var info = document.getElementsByClassName("info")[0];
		var checkSong = info.children[0].children[0].innerHTML;
		var img = document.getElementsByClassName("playerBarArt")[0].src;
		if (checkSong.toLowerCase() !== lastSong.toLowerCase()){
			var artist = info.children[1].children[1].innerHTML;
			var album = info.children[2].children[1].innerHTML;
			if (String(img) == no_Artwork && String(lastImg) == no_Artwork && !again){
				setTimeout(function (){ run(true); }, 1000);
			} else {
				if (String(img) !== String(lastImg) || (String(img) == no_Artwork && String(lastImg) == no_Artwork) ){
					lastImg = String(img);
					if (checkSong == "ad" || checkSong == "audioad"){
						tabTitle("Ad");
						createNoti(logoLink," ","Advertisement",0);
					} else {
						tabTitle(cutString(cleanString(checkSong))+"- "+cutString(cleanString(artist)));
						lastAlbum = album;
						newSong(img,checkSong,artist,album);
					}
				} else if (album.toLowerCase() == lastAlbum.toLowerCase()){
					tabTitle(cutString(cleanString(checkSong))+"- "+cutString(cleanString(artist)));
					newSong(img,checkSong,artist,album);
				}
			}
		} else {
			lastSong = checkSong;
			lastImg = String(img);
		}
	}
}

function runWhenClicked(){ if (preferences[1]){ checkIfSkipped(false); }}

function getRidOfErrorBox(){
	$(".toastItemClose").click();
	if (!document.getElementsByClassName("toastItemClose")){
		setTimeout(function (){ getRidOfErrorBox(); }, 500);
	} else {
		$(".toastItemClose").click();
	}
}

function inject_div_holder(){
	newButton = document.createElement('div');
	newButton.id = "uhoh";
}

function waitForLoad(){
	if (!!document.getElementsByClassName("TunerControl")[0]){
		return;
	}
	setTimeout(function(){ waitForLoad(); }, 500);
}

$(document).ready(function(){
	console.log("main started");
	waitForLoad();
	getPreferences();
	chrome.runtime.sendMessage({method: 'mainStarted'}, function(response){} );
	//document.getElementsByClassName("TunerControl")[0].onclick = runWhenClicked;
	setInterval(function(){ getPreferences(); }, 15000);
	setInterval(function(){ run(false); }, 3000);
	//getRidOfErrorBox();
	//inject_div_holder();
});