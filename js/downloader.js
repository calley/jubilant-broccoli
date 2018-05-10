var ExtensionTabID;
var downloadLinks = [];
var downloadLinksAutoDownloaded = [];
localStorage["PandoraDownloads"] = "";
var lastDownloadLink = "";
var downloadNames = [];
localStorage["PandoraDownloadNames"] = "";
var pastArtwork = [];
localStorage["PandoraPArtwork"] = "";
var pastSongArtist = [];
localStorage["PandoraPSArtist"] = "";
var pastSongAlbum = [];
localStorage["PandoraPSAlbum"] = "";
var pastSongInfoNames = [];
localStorage["PandoraPSInfoNames"] = "";

var clean = [["&amp;","&"]];
var pref = JSON.parse(localStorage["PandoraNEWPreferences"]);
var advanced_options = JSON.parse(localStorage["PandoraAdvPreferences"]);

function cleanString(str){
	var cleand = String(str);
	for (var i = 0; i < clean.length; i++){
		while ((cleand.indexOf(clean[i][0])) !== -1){
			cleand = cleand.replace(clean[i][0],clean[i][1]);
		}
	}
	return cleand;
}

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

function received_DL_Link(){
	console.log("received_DL_Link:");
	chrome.tabs.query({}, function (tabs){
		for (var i = 0; i < tabs.length; i++) {
			if (tabs[i].url.search("www.pandora.com/") > -1){
				chrome.tabs.sendMessage(tabs[i].id, {method: "song_details_request"},  function(response){
					//var mess = cutString(cleanString("by "+response.artist),false)+"\n"+cutString(cleanString("on "+response.album),false);
					//internal_request({method: "NewSong", data: (response.title+" by "+response.artist), album: response.album, artist: response.artist, image: response.art, name: response.title, link: undefined}, undefined, undefined);
				});
			}
		}
	});
}

chrome.webRequest.onHeadersReceived.addListener(function(details) {
    for (var i = 0; i < details.responseHeaders.length; ++i) {
        if (details.responseHeaders[i].name === 'Content-Type') {
        	console.log("DL:", details.responseHeaders[i].value, details.url);
            if ( (details.responseHeaders[i].value == "audio/mp4" || details.responseHeaders[i].value == "audio/mpeg") || ((details.url.indexOf("http://audio") > -1 || details.url.indexOf("https://audio") > -1) && details.url.indexOf("pandora.com/access/") > -1)){
            	if (lastDownloadLink != details.url){
					lastDownloadLink = details.url;
					console.log("DL:", lastDownloadLink);
					received_DL_Link();
				}
            }
            break;
        }
    }
    return {requestHeaders: details.requestHeaders};
},
{urls: ["<all_urls>"]},
["responseHeaders"]);

function UpdateDownloadButton(){
	chrome.tabs.query({}, function(tabs){
		for (var i=0; i<tabs.length; ++i){
			chrome.tabs.sendMessage(tabs[i].id, {method: 'newDownloadLink', dlLink: lastDownloadLink}, function(response) {});
		}
	});
}

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

function cleanString(str){
	var cleand = String(str);
	for (var i = 0; i < clean.length; i++){
		while ((cleand.indexOf(clean[i][0])) !== -1){
			cleand = cleand.replace(clean[i][0],clean[i][1]);
		}
	}
	return cleand;
}


function printCustomData(data, name, artist, album){
	var sample = data;
	while (sample.indexOf("*s") > -1){
		sample = sample.replace("*s", name);
	}
	while (sample.indexOf("*a") > -1){
		sample = sample.replace("*a", artist);
	}
	while (sample.indexOf("*l") > -1){
		sample = sample.replace("*l", album);
	}
	return sample;
}

function control_music(task){
	chrome.tabs.query({}, function(tabs){
		for (var i=0; i<tabs.length; ++i){
			if (tabs[i].url.indexOf("pandora.com")){
				chrome.tabs.sendMessage(tabs[i].id, {method: task});
			}
		}
	});
}

function create_notification(icon, tit, mess, isSong, length){
	pref = JSON.parse(localStorage["PandoraNEWPreferences"]);
	if (pref[4]){
		console.log("notification", icon, tit, mess, isSong, pref[0]);
		//chrome.notifications.create({type: "basic", iconUrl: icon, title: "Random", message: "Message"}, function(notificationId){});
		chrome.notifications.create({type: "basic", iconUrl: icon, title: tit, message: mess},
			function(notificationId){
				console.log("created");
				if (!isSong){
					setTimeout(function(){ chrome.notifications.clear(notificationId); }, Number(pref[0])*1000)
				} else {
					if (pref[1]){
						chrome.notifications.onClicked.addListener(function(notId) {
							if (pref[3]){
								control_music('TD_music');
							} else if (pref[2]){
								control_music('TU_music');
							} else {
								control_music('skip_music');
							}
						});
					}
					setTimeout(function(){ chrome.notifications.clear(notificationId); },  Number(pref[0])*1000);
				}
			}
		);
	}
}

document.body.innerHTML += '<div class="pastHolder" id="pastSongs"></div>';

function init_download(link, title){
	console.log("download requested", link, title);
	cur_DL_name = title;
	cur_DL_url = link;
	chrome.downloads.download({
		url: link,
		filename: title,
		conflictAction: "uniquify"
	}, function(downloadId){

	});
}


function getSongFile(urlToSongFile, request){
	console.log("[getSongFile]",  request.name, urlToSongFile);

	var arrayBuffer = new ArrayBuffer();

	const xhr = new XMLHttpRequest();
	xhr.open('GET', urlToSongFile, true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function () {
		if (xhr.status === 200) {
			const arrayBuffer = xhr.response;
			// go next
			getCoverFile(request.image, arrayBuffer, request);
		} else {
			// handle error
			console.error(xhr.statusText + ' (' + xhr.status + ')');
		}
	};
	xhr.onerror = function() {
		// handle error
		console.error('Network error');
	};
	xhr.send();

}

function getCoverFile(urlToCoverFile, SongArrayBuffer, request){
	console.log("[getCoverFile]", request.name, urlToCoverFile);

	var arrayBuffer = new ArrayBuffer();

	const xhr = new XMLHttpRequest();
	xhr.open('GET', urlToCoverFile, true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function () {
		if (xhr.status === 200) {
			const arrayBuffer = xhr.response;
			// go next
			tagFile(SongArrayBuffer, arrayBuffer, request);
		} else {
			// handle error
			console.error(xhr.statusText + ' (' + xhr.status + ')');
		}
	};
	xhr.onerror = function() {
		// handle error
		console.error('Network error');
	};
	xhr.send();

}


function tagFile(songArrayBuffer, coverArrayBuffer, request){
	//console.log("[tagFile]", request.name, request.method);

	var download_view = request.data;
	var name = request.name;
	var artist = request.artist;
	var album = request.album;

	var station = request.station.replace(" - Now Playing on Pandora","");

	// arrayBuffer of song or empty arrayBuffer if you just want only id3 tag without song
	const writer = new ID3Writer(songArrayBuffer);
	writer.setFrame('TIT2', name)
			//.setFrame('TPE1', [artist])
			.setFrame('TPE2', artist)
			.setFrame('TALB', album)
		  .setFrame('WORS', 'https://pandora.com')
		  .setFrame('WOAS', request.data)
			.setFrame('WCOM', station)
			.setFrame('WCOP', station)
			//.setFrame('WPAY', 'https://google.com')

	      .setFrame('APIC', {
			  type: 3,
			  data: coverArrayBuffer,
			  description: 'Cover from Pandora' })

				.setFrame('COMM', {
				    description: 'description here',
				    text: 'text here'
				});

	writer.addTag();

	const taggedSongBuffer = writer.arrayBuffer;
	//const blob = writer.getBlob();
	const url = writer.getURL();

	var outFileName = name+" - "+artist+" - "+album+".mp3";
	outFileName = outFileName.replace("/","_").replace("\\","_").replace(":","-");
	//outFileName = request.station+"/"+outFileName;
	station = station.replace("/","_").replace("\\","_").replace(":","-");

	outFileName = station+"/"+outFileName;
	console.log("tagFile", outFileName);

	//Testing outFileName
	outFileName = "asdf.mp4";

	chrome.downloads.download({
		url : url,
		filename : outFileName
	});

}


function internal_request(request, sender, sendResponse){
	console.log("__internal_request");
	if (request.method === "NewSong"){
		if (lastDownloadLink!=""){
			//chrome.notifications.create({type: "basic", iconUrl: "photos/face.png", title: "Random", message: "Message"}, function(notificationId){});
			console.log("Received");
			create_notification(request.image, cutString(cleanString(request.name),true), cutString(cleanString("by "+request.artist),false)+"\n"+cutString(cleanString("on "+request.album),false), true, 0);
			chrome.runtime.sendMessage({method: 'newSongRecieved', data: request.data},function(response){} );
			if (downloadLinks.indexOf(lastDownloadLink)==-1){
				if (request.data.toLowerCase().indexOf("advertisement") > -1){
					// ad
					console.log("Advertisement");
				} else if (downloadNames.indexOf(request.data)==-1 && downloadLinks.length==downloadNames.length && pastSongInfoNames.indexOf(request.name)==-1 && pastSongArtist.length==pastArtwork.length && pastSongArtist.length==pastSongInfoNames.length){
					console.log("New Song: "+request.data);
					//UpdateDownloadButton();
					downloadNames.push(request.data);
					localStorage["PandoraDownloadNames"] = JSON.stringify(downloadNames);
					downloadLinks.push(lastDownloadLink);
					localStorage["PandoraDownloads"] = JSON.stringify(downloadLinks);
					pastSongArtist.push(request.artist);
					localStorage["PandoraPSArtist"] = JSON.stringify(pastSongArtist);
					pastSongAlbum.push(request.album);
					localStorage["PandoraPSAlbum"] = JSON.stringify(pastSongAlbum);
					pastArtwork.push(request.image);
					localStorage["PandoraPArtwork"] = JSON.stringify(pastArtwork);
					pastSongInfoNames.push(request.name);
					localStorage["PandoraPSInfoNames"] = JSON.stringify(pastSongInfoNames);

					console.log("Link:", lastDownloadLink);

					advanced_options = JSON.parse(localStorage["PandoraAdvPreferences"]);
					if (advanced_options[0]){
						var download_view = request.data;
						var name = request.name;
						var artist = request.artist;
						var album = request.album;
						if (advanced_options[1] && advanced_options[2] != "" && advanced_options[2] != "false"){
							download_view = printCustomData(advanced_options[2], name, artist, album);
						} else {
							download_view = download_view+".mp4";
						}
						/*var clicker = '<a class="dlLinks" href="'+lastDownloadLink+'" target="blank" download="'+(download_view)+'">Download</a>';
						document.getElementById("pastSongs").innerHTML = clicker;
						document.getElementsByClassName("dlLinks")[0].click();*/
						//init_download(lastDownloadLink, download_view);

						//download Album image...  added by calley 5-1-18
						var imagefile = artist+" - "+album+request.image.substr(request.image.length - 4);
						//init_download(request.image, imagefile);

						getSongFile(lastDownloadLink, request);
					}
				} else {
					// song that already played

				}
			} else {
				// song that already played
			}
		} else {
			setTimeout(function(){ internal_request(request, sender, sendResponse); }, 500);
		}
    }
}

var cur_DL_name, cur_DL_url;
chrome.downloads.onDeterminingFilename.addListener(function(downloadItem, suggest){
	console.log("[downloader]", downloadItem.url, downloadItem.filename);
	if (downloadItem.url == cur_DL_url){
		suggest({filename: cur_DL_name, conflictAction: "uniquify"});
	}
});

function new_request(request, sender, sendResponse){
	console.log("[new_request]", request.method);
	if (request.method === "noti"){
    	create_notification(request.image, request.title, request.msg, false, request.length);
    } else if (request.method === "song_details_request_response"){
    	var mess = cutString(cleanString("by "+request.artist),false)+"\n"+cutString(cleanString("on "+request.album),false);
		internal_request({method: "NewSong", data: (request.title+" by "+request.artist), album: request.album, artist: request.artist, image: request.art, name: request.title, station: sender.tab.title, link: undefined}, undefined, undefined);
    }
}

chrome.extension.onRequest.addListener(new_request);

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	 if (request.method === "getDLInfo"){
    	sendResponse({ links: localStorage["PandoraDownloads"], names: localStorage["PandoraDownloadNames"] });
    } else if (request.method === "getSongInfo"){
    	sendResponse({ name: localStorage["PandoraPSInfoNames"], album: localStorage["PandoraPSAlbum"], artist: localStorage["PandoraPSArtist"], artwork: localStorage["PandoraPArtwork"] });
    } else if (request.method==="downloadSong"){
    	init_download(request.link, request.fn);
    }
});
