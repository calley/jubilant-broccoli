chrome.runtime.sendMessage({method: 'mainStarted'}, function(response){} );

var logoLink = chrome.extension.getURL("photos/facenoti.png");
var clean = [["&amp;","&"]];
var no_Artwork = "http://www.pandora.com/img/no_album_art.png";

var artHolder = null;

var lastSong = "";
var lastArtist = "";
var lastAlbum = "";
var lastImg = "";
var lastLink = "";

var listener = null;

var preferences = ["4",true,false,false,false,true];

var last_song = "";
var last_artist = "";
var last_station = "";
var previous_songs = [];

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

function tabTitle(txt){ document.title = txt; }

var colors;
var orig_bottom_bar_color = -1;
var orig_opac = -1;

function color_func_helper(){
	if ($(".Tuner").length == 0){
		//setTimeout(function(){ color_func_helper(); }, 500);
	} else {
		if (orig_bottom_bar_color == -1){
			orig_bottom_bar_color = $(".Tuner").css("background-color");
		}
		if (orig_opac == -1){
			orig_opac = $(".AppBg__img").css("opacity");
		}
		$(".Tuner").css({"background-color": colors[0]});
		$(".AppBg__img").css({"opacity": colors[5]});
		$("#enhancedColor").remove();
		var back_color = 'radial-gradient(ellipse at center,'+colors[1]+' 0,'+colors[2]+' 100%),linear-gradient(45deg,'+colors[3]+','+colors[4]+')';
		$('head').append('<style id="enhancedColor">body:before{background-image:'+back_color+'}</style>');
	}
}

function background_color(){
	chrome.runtime.sendMessage({method: 'getColorPref'}, function(response){
		if (response.rep != "na"){
			colors = JSON.parse(response.rep);
			console.log("colors:", colors);
			color_func_helper();
		} else {
			console.log("colors not enabled");
			$("#enhancedColor").remove();
			if (orig_bottom_bar_color != -1){
				$(".Tuner").css({"background-color": orig_bottom_bar_color});
			}
			if (orig_opac != -1){
				$(".AppBg__img").css({"opacity": orig_opac});
			}
		}
	});
}

function isPlaying(){
	console.log("[function usage] isPlaying");
	var a = document.getElementsByClassName("TunerControl");
	for (var i = 0; i < a.length; i++){
		if (!!a[i].getAttribute("class") && a[i].getAttribute("class").indexOf("PlayButton") > -1){
			if (a[i].getAttribute("data-qa").indexOf("play")>-1){
				// paused
				return 0;
			} else {
				// playing
				return 1;
			}
		}
	}
}

function getCurrentAlbum(){
	console.log("[function usage] getCurrentAlbum");
	if (!!$('[data-qa="playing_album_name"]') && !!$('[data-qa="playing_album_name"]')[0]){
		return $('[data-qa="playing_album_name"]')[0].innerHTML;
	} else if ( $('[data-qa="header_now_playing_link"]').attr("class").indexOf("active")==-1 ){
		return "";
	}
	return undefined;
}

function get_current_station(){
	console.log("[function usage] get_current_station");
	if ($(".StationListItem--1").length>0 && $(".StationListItem--1")[0].innerText.indexOf("Radio")>-1){
		return $.trim($(".StationListItem--1")[0].innerText);
	}
	return undefined;
}

function getArt(){
	console.log("[function usage] getArt");
	if (!!document.querySelector("div[data-qa='album_active_image']")){
		var s = document.querySelector("div[data-qa='album_active_image']").getAttribute("style");
		s = s.slice(23,s.length-3);
		if (s.indexOf("web")>-1 && s.indexOf("client")>-1 && s.indexOf("empty")>-1 && s.indexOf("album")>-1){
			s = "https://www.pandora.com"+s;
		}
		if (s != undefined && s != null){
			return s;
		}
	} else if ( $('[data-qa="header_now_playing_link"]').attr("class").indexOf("active")==-1 ){
		return $('[data-qa="mini_track_image"]').attr("src");
	} else if ( !!document.querySelector("div[data-qa='album_active_image_default']") ){
		var s = document.querySelector("div[data-qa='album_active_image_default']").getAttribute("style");
		s = s.slice(23,s.length-3);
		s = "https://www.pandora.com"+s;
		if (s != undefined && s != null){
			return s;
		}
	}
	return undefined;
}

function getTunerControls(which){
	console.log("[function usage] getTunerControls");
	if (!!$(".Tuner__Controls")[0]){
		var controls = $($(".Tuner__Controls")[0]).find("button");
		if (!!controls[which]){
			return controls[which];
		}
	}
	return null;
}

function getElapsedTime(which){
	console.log("[function usage] getElapsedTime");
	var a = document.getElementsByClassName("Tuner");
	for (var i = 0; i < a.length; i++){
		if (!!a[i].children && a[i].children.length == 5){
			for (var t = 0; t < a[i].children.length; t++){
				if (!!a[i].children[t].getAttribute("class") && a[i].children[t].getAttribute("class").indexOf("Duration")>-1){
					return a[i].children[t].children[0].children[0].children[which].innerHTML;
				}
			}
		}
	}
	return null;
}

function current_song_playing(){
	console.log("[function usage] current_song_playing");
	var song_holder = $(".Tuner__Audio__TrackDetail")[0];
	if (!!song_holder && $.trim(song_holder.innerText).length>0){
		var album = getCurrentAlbum();
		var art = getArt();
		var check_song = song_holder.innerText;
		if (album!=undefined && art!=undefined && !!check_song){
			var song_data = check_song.slice(1).split("\n");
			var title = song_data[0];
			var artist = song_data[1];	
			return [art,title,artist,album];
		}
	}
	return undefined;
}

function new_song_checker(){
	console.log("[function usage] new_song_checker");
	var song_holder = $(".Tuner__Audio__TrackDetail")[0];
	if (!!song_holder && $.trim(song_holder.innerText).length>0){
		var album = getCurrentAlbum();
		var art = getArt();
		var check_song = song_holder.innerText;
		if (/*check_song != last_song && */album!=undefined && art!=undefined){
			last_song = check_song;
			last_station = get_current_station();
			
			var song_data = last_song.slice(1).split("\n");
			var title = song_data[0];
			var artist = song_data[1];
			
			console.log('new song:\n"'+title+'" by "'+artist+'" on "'+album+'"');
			console.log("On", last_station);
			if (previous_songs.indexOf(last_song) == -1){		
				// Notification and send to extension
				previous_songs.push(last_song);
				return [art,title,artist,album];
				//newSong(art,title,artist,album);
			} else {
				console.log("[ -- Song has already played -- ]");
				return [];
			}
		} else {
			console.log("something went wrong");
		}
	}
	return undefined;
}

function chrome_request_handler(request, sender, sendResponse){
	console.log("[function usage] chrome_request_handler:", !!request.action?request.action:request.method);
	if (request.action == 'settingsChangedReq'){
		getPreferences();
	} else if (request.method == "pause_music"){
		if (isPlaying()){
			getTunerControls(2).click();
		}
	} else if (request.method == "play_music"){
		if (!isPlaying()){
			getTunerControls(2).click();
		}
	} else if (request.method == "skip_music"){
		getTunerControls(3).click();
	} else if (request.method == "TU_music"){
		getTunerControls(4).click();
	} else if (request.method == "TD_music"){
		getTunerControls(0).click();
	} else if (request.method == "currentSong"){
		var song_data = current_song_playing();
		console.log("popup- info requested:", song_data);
		if (song_data != undefined){
			sendResponse({data: (song_data[1]+" by "+song_data[2]), status: isPlaying(), thumbU: getTunerControls(4).getAttribute("class").indexOf("active")>-1, thumbD: getTunerControls(0).getAttribute("class").indexOf("active")>-1 });
		}
	} else if (request.method == "time_info"){
		sendResponse({rem: $('[data-qa="remaining_time"]')[0].innerHTML, elt: $('[data-qa="elapsed_time"]')[0].innerHTML});
	} else if (request.method == "active_tab"){
		chrome.runtime.sendMessage({method: 'active_tab', data: request.data}, function(response){} );
	} else if (request.method == "song_details_request"){
		var song_data = new_song_checker();
		if (song_data!=undefined && song_data.length>0){
			//[art,title,artist,album]
			var st_start = "window._store = ";
			var page_url = $('[data-qa="mini_track_title"]')[0].href;
			$.get(
				page_url,
				function(data){
					
					data = data.slice(data.indexOf(st_start),data.length-1);
					var base_pos = data.indexOf(page_url);
					if (data.indexOf("albumArt") != -1){
						data = data.slice(base_pos,data.length-1);
						var album_artwork = JSON.parse(data.slice(data.indexOf("["),data.indexOf("]")+1));
						if (!!album_artwork[2]){
							album_artwork = album_artwork[2].url;
						} else if (!!album_artwork[1]){
							album_artwork = album_artwork[1].url;
						} else if (!!album_artwork[0]){
							album_artwork = album_artwork[0].url;
						} else {
							album_artwork = undefined;
						}
						if (album_artwork == undefined && song_data[0].indexOf("images/album_500.png") > -1){
							album_artwork = song_data[0];
						}
						console.log("artwork:", album_artwork);
						background_color();
						chrome.extension.sendRequest({method: "song_details_request_response", art:album_artwork, title:song_data[1], artist:song_data[2], album:song_data[3]});
						//sendResponse({art:album_artwork, title:song_data[1], artist:song_data[2], album:song_data[3]});
					}
				}
			);
		} else if (song_data==undefined){
			setTimeout(function(){  chrome_request_handler(request, sender, sendResponse); }, 300);
		}
	} else if (request.action == "update_colors"){
		background_color();
	}
}

chrome.runtime.onMessage.addListener(chrome_request_handler);

$(document).ready(function(){
	getArt();
});