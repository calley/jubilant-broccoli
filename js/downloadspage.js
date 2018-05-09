$(document).ready(function(){
	var clean = [["&amp;","&"],["/n","</br>"]];
	document.title = "Downloads";
	$(".songTimebarr").hide();
	$("#no_dl").hide();
	
	var $window = $(window), $stickyEl = $('#FDLabel'), elTop = $stickyEl.offset().top;

	$window.scroll(function() {
		elTop = $stickyEl.offset().top;
		if ($window.scrollTop() > elTop){
			$("#topBarText").text("Failed Downloads");
		} else {
			$("#topBarText").text("Downloads");
		}
	});
	
	function cleanString(str){
		var cleand = String(str);
		for (var i = 0; i < clean.length; i++){
			while ((cleand.indexOf(clean[i][0])) !== -1){
				cleand = cleand.replace(clean[i][0],clean[i][1]);
			}
		}
		return cleand;
	}

	function cutString(str,lent){
		return str;
		/*if (str.length > lent){
			return str.slice(0,lent)+"...";
		} else {
			return str;
		}*/
	}

	function convertToTime(t){
		var seconds = Math.floor(t%60);
		var minutes = Math.floor(t/60);
		if (seconds<10){ seconds = "0"+seconds; }
		return minutes+":"+seconds;
	}

	var pastSongArtist, pastSongAlbum, pastArtwork, pastSongNames, downloadLinks, downloadNames;
	
	getDLInfo();
	function getDLInfo(){
		chrome.runtime.sendMessage({method: 'getDLInfo'},
			function(response){
				if (response.links.length == 0 && response.names.length == 0){
					$("#page").hide();
					$("#no_dl").show();
				} else {
					$("#page").show();
					$("#no_dl").hide();
					downloadLinks = JSON.parse(response.links);
					downloadNames = JSON.parse(response.names);
					getSongInfo();
				}
			}
		);
	}

	function getSongInfo(){
		chrome.runtime.sendMessage({method: 'getSongInfo'},
			function(response){
				pastSongArtist = JSON.parse(response.artist);
				pastSongAlbum = JSON.parse(response.album);
				pastArtwork = JSON.parse(response.artwork);
				pastSongNames = JSON.parse(response.name);
				load();
			}
		);
	}

	function togglePlayOnPandora(play){
		if (play){
			playMusic();
		} else {
			pauseMusic();
		}
	}

	function badLink(link){
		var songs = document.getElementsByClassName("pastSongss");
		var newHolder = document.getElementById("failedDL");
		for (var i = 0; i < songs.length; i++){
			if (songs[i].children[1].children[3].children[0].href.indexOf(link)>-1){
				songs[i].children[1].children[3].style.display = 'none';
				newHolder.appendChild(songs[i]);
			}
		}
		document.getElementById("FDLabel").style.display = 'initial';
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
	
	function pauseMusic(tabId){
		chrome.runtime.sendMessage({method: 'pause_music'}, function(response){});
	}
	
	function playMusic(tabId){
		chrome.runtime.sendMessage({method: 'play_music'}, function(response){});
	}

	var curPage = 1;
	var numObjects = 0;

	function load(){
		if (downloadLinks.length == 0){
			$("#page").hide();
			$("#no_dl").show();
		}
		if (numObjects == downloadLinks.length){ return false };
		var advanced_options = JSON.parse(localStorage["PandoraAdvPreferences"]);
		numObjects = downloadLinks.length;
		console.log(numObjects);
		var audioPlaying = new Audio();
		audioPlaying.addEventListener("loadedmetadata", function(_event) {
			audioPlaying.play();
			$(".songTimebarr").show();
			setInterval(function (){
				if (audioPlaying.duration > audioPlaying.currentTime){
					//$("#curTime").html(convertToTime(audioPlaying.currentTime)+" / "+convertToTime(audioPlaying.duration));
					$("#progressBar").width((audioPlaying.currentTime/audioPlaying.duration)*100+"%");
				} else {
					//$("#curTime").html("");
					$(".playSong").attr("src","../photos/playIcon.png");
					$(".songTimebarr").hide();
				}
			},1000);
		});
		function showPastSongs(){
			$("#pastSongs").empty();
			$(".songTimebarr").hide();
			for (var i = 0; i<pastSongNames.length; i++){
				if (badLs.indexOf(downloadLinks[pastArtwork.length-i-1]) == -1){
					var download_view = downloadNames[pastArtwork.length-i-1];
					var name = cutString(cleanString(pastSongNames[pastArtwork.length-i-1]),30);
					var artist = cutString(cleanString(pastSongArtist[pastArtwork.length-i-1]),60);
					var album = cutString(cleanString(pastSongAlbum[pastArtwork.length-i-1]),60);
					if (advanced_options[1] && advanced_options[2] != "" && advanced_options[2] != "false"){
						download_view = printCustomData(advanced_options[2], name, artist, album);
					} else {
						download_view = download_view+".mp4";
					}
					/*if (audioPlaying.src == downloadLinks[pastArtwork.length-i-1] && (!audioPlaying.paused && !audioPlaying.ended && 0 < audioPlaying.currentTime)){
						$("#pastSongs").append('<div class="pastSongss"><img src="'+pastArtwork[pastArtwork.length-i-1]+'"></img><div class="songInfo"><div class="songName">'+name+'</div><p>by '+artist+'</p><p>on '+album+'</p><p><a class="dlLinks" href="'+downloadLinks[pastArtwork.length-i-1]+'" target="blank" download="'+(download_view)+'">Download</a><input type="image" class="playSong" src="../photos/pauseIcon.png" value="'+downloadLinks[pastArtwork.length-i-1]+'"/></p></div></div>');
					} else {
						$("#pastSongs").append('<div class="pastSongss"><img src="'+pastArtwork[pastArtwork.length-i-1]+'"></img><div class="songInfo"><div class="songName">'+name+'</div><p>by '+artist+'</p><p>on '+album+'</p><p><a class="dlLinks" href="'+downloadLinks[pastArtwork.length-i-1]+'" target="blank" download="'+(download_view)+'">Download</a><input type="image" class="playSong" src="../photos/playIcon.png" value="'+downloadLinks[pastArtwork.length-i-1]+'"/></p></div></div>');
					}*/
					if (audioPlaying.src == downloadLinks[pastArtwork.length-i-1] && (!audioPlaying.paused && !audioPlaying.ended && 0 < audioPlaying.currentTime)){
						$("#pastSongs").append('<div class="pastSongss"><img src="'+pastArtwork[pastArtwork.length-i-1]+'"></img><div class="songInfo"><div class="songName">'+name+'</div><p>by '+artist+'</p><p>on '+album+'</p><p><div><div class="dlLinks space" href="'+downloadLinks[pastArtwork.length-i-1]+'" value="'+(download_view)+'" style="display: inline;">Download</div><input type="image" class="playSong space" src="../photos/pauseIcon.png" value="'+downloadLinks[pastArtwork.length-i-1]+'"/></p></div></div></div>');
					} else {
						$("#pastSongs").append('<div class="pastSongss"><img src="'+pastArtwork[pastArtwork.length-i-1]+'"></img><div class="songInfo"><div class="songName">'+name+'</div><p>by '+artist+'</p><p>on '+album+'</p><p><div><div class="dlLinks space" href="'+downloadLinks[pastArtwork.length-i-1]+'" value="'+(download_view)+'" style="display: inline;">Download</div><input type="image" class="playSong space" src="../photos/playIcon.png" value="'+downloadLinks[pastArtwork.length-i-1]+'"/></p></div></div></div>');
					}
				}
			}
			$(".playSong").click(function(){
				if (audioPlaying.src == $(this).val()){
					if (audioPlaying.paused && !audioPlaying.ended && 0 < audioPlaying.currentTime){
						togglePlayOnPandora(false);
						audioPlaying.play();
						$(".songTimebarr").show();
						$(this).attr("src","../photos/pauseIcon.png");
					} else {
						audioPlaying.pause();
						$(".songTimebarr").hide();
						togglePlayOnPandora(true);
						$(this).attr("src","../photos/playIcon.png");
					}
				} else {
					$(".playSong").attr("src","../photos/playIcon.png");
					audioPlaying.src = $(this).val();
					togglePlayOnPandora(false);
					$(".songTimebarr").show();
					$(this).attr("src","../photos/pauseIcon.png");
				}
			});
			$(".dlLinks").click(function(){
				console.log($(this).attr("href"), $(this).attr("value"));
				chrome.runtime.sendMessage({
					method: 'downloadSong',
					link: $(this).attr("href"),
					fn: $(this).attr("value")
				}, function(response){});
			});
		}
		showPastSongs();
		runThroughLinks();
	}

	function toggleDLGUI(bad){
		if (bad.length == 0){
			document.getElementById("FDLabel").style.display = 'none';
		} else {
			document.getElementById("FDLabel").style.display = 'initial';
		}
	}

	var badLs = [];
	var first = true;
	var workingLinks = false;

	function runThroughLinks(){
		workingLinks = false;
		function testLinks(link,cur,tot){
			if (badLs.indexOf(link)>-1){
				if (cur < tot){
					testLinks(downloadLinks[cur+1],cur+1,tot);
				} else {
					workingLinks = false;
					toggleDLGUI(badLs);
				}
			} else if (!workingLinks){
				$.get(link).fail(function(){
					badLs.push(link);
					badLink(link);
					if (cur < tot){
						testLinks(downloadLinks[cur+1],cur+1,tot);
					} else {
						workingLinks = false;
						toggleDLGUI(badLs);
					}
				}).success(function(){
					workingLinks = true;
					toggleDLGUI(badLs);
				});
			}
		}
	
		if (first){
			document.getElementById("FDLabel").style.display = 'none';
			testLinks(downloadLinks[0],0,downloadLinks.length-1);
			first = false;
		} else if (badLs.length == 0){
			document.getElementById("FDLabel").style.display = 'none';
			testLinks(downloadLinks[0],0,downloadLinks.length-1);
		} else {
			document.getElementById("FDLabel").style.display = 'initial';
			testLinks(downloadLinks[0],0,downloadLinks.length-1);
		}
	}

	chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
		if (request.method == "reloadDLPage"){
			if (confirm("Advanced settings changed, would you like to apply them to this page?")){
				document.location.reload();
			}
		}
	});
	
	setInterval(function (){
		getDLInfo();
	},3000);
});