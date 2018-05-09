$(document).ready(function(){
	
	$('#openDLPage').click(function(){
    	chrome.runtime.sendMessage({method: 'openDLPage'}, function(response){} );
	});
	
	$('#openOptions').click(function(){
    	chrome.runtime.sendMessage({method: 'openOptions'}, function(response){} );
	});
	
	$('#openColorPicker').click(function(){
		chrome.runtime.sendMessage({method: 'popup_color_picker'}, function(response){} );
	});
	
	$('#openDonate').click(function(){
    	$('<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank"><input class="butt" type="submit" value="Donations" border="1" alt="Donations"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----"></form>').appendTo('body').submit();
	});
	
	var playing = false;
	var wid = 0;
	var total_length = 0;
	
	function convertToTime(t){
		var seconds = Math.floor(t%60);
		var minutes = Math.floor(t/60);
		if (seconds<10){ seconds = "0"+seconds; }
		return minutes+":"+seconds;
	}
	
	function updateplaypause(){
		if (playing){
			$('#toggle').attr("src", "../photos/controls/btn_pause.png");
		} else {
			$('#toggle').attr("src", "../photos/controls/btn_play.png");
		}
	}	
	function newName(name){
		if (name.length > 47){
			name = name.slice(0,47)+"...";
		}
		$('#playerBarName').html(name);
	}
	$('#t_down').click(function(){
		$('#t_up').attr("src", "../photos/controls/btn_up.png");
    	chrome.runtime.sendMessage({method: 'TD_music'}, function(response){} );
    	if ($('#t_down').attr("src") == "../photos/controls/btn_down_indicator.png"){
    		$('#t_down').attr("src", "../photos/controls/btn_down.png")
    	} else {
    		$('#t_down').attr("src", "../photos/controls/btn_down_indicator.png")
    	}
    });
    $('#t_up').click(function(){
    	chrome.runtime.sendMessage({method: 'TU_music'}, function(response){} );
    	if ($('#t_up').attr("src") == "../photos/controls/btn_up_indicator.png"){
    		$('#t_up').attr("src", "../photos/controls/btn_up.png")
    	} else {
    		$('#t_up').attr("src", "../photos/controls/btn_up_indicator.png")
    	}
    });
    $('#toggle').click(function(){
    	chrome.tabs.query({}, function(tabs){
			var found = false;
			for (var i=0; i<tabs.length; ++i){
				if (tabs[i].url.search("www.pandora.com/") > -1){
					found = true;
				}
			}
			if (!found){
				chrome.runtime.sendMessage({method: 'openPandora'}, function(response){} );
			} else {
				if (playing){
					chrome.runtime.sendMessage({method: 'pause_music'}, function(response){} );
					playing = false;
					updateplaypause();
				} else {
					chrome.runtime.sendMessage({method: 'play_music'}, function(response){} );
					playing = true;
					updateplaypause();
				}
			}
		});
    });
    $('#skip').click(function(){
    	chrome.runtime.sendMessage({method: 'skip_music'}, function(response){} );
    });
    
    function data_helper(tabId){
    	chrome.tabs.sendMessage(tabId, {method: "currentSong"}, function(response){
			console.log(response);
			if (response != undefined){
				newName(response.data);
				playing = response.status;
				updateplaypause();
				if (response.thumbU){
					$('#t_up').attr("src", "../photos/controls/btn_up_indicator.png");
				} else {
					$('#t_up').attr("src", "../photos/controls/btn_up.png");
				}
				if (response.thumbD){
					$('#t_down').attr("src", "../photos/controls/btn_down_indicator.png");
				} else {
					$('#t_down').attr("src", "../photos/controls/btn_down.png");
				}
			}
		});
    }
    
    function getCurData(){
		chrome.tabs.query({}, function(tabs){
			var found = false;
			for (var i=0; i<tabs.length; ++i){
				if (tabs[i].url.search("www.pandora.com/") > -1){
					found = true;
					data_helper(tabs[i].id);
					/*chrome.tabs.sendMessage(tabs[i].id, {method: "currentSong"}, function(response){
						console.log(response);
						newName(response.data);
						playing = response.status;
						updateplaypause();
						if (response.thumbU){
							$('#t_up').attr("src", "../photos/controls/btn_up_indicator.png");
						} else {
							$('#t_up').attr("src", "../photos/controls/btn_up.png");
						}
						if (response.thumbD){
							$('#t_down').attr("src", "../photos/controls/btn_down_indicator.png");
						} else {
							$('#t_down').attr("src", "../photos/controls/btn_down.png");
						}
					});*/
				}
			}
			if (!found){
				playing = false;
			}
		});
	}
	function convertToSeconds(time){
		if (time.indexOf(":") > -1){
			var temp = time.split(":");
			return (Number(temp[0])*60+Number(temp[1]));
		} else {
			return time;
		}
	}
	function controlTime(override){
		if (playing || override){
			chrome.tabs.query({}, function(tabs){
				for (var i=0; i<tabs.length; ++i){
					if (tabs[i].url.indexOf("pandora.com") > -1){
						chrome.tabs.sendMessage(tabs[i].id, {method: 'time_info'}, function(response){
							wid = convertToSeconds(response.elt);
							//total_length = wid+convertToSeconds(response.rem.slice(1,response.rem.length));
							total_length = convertToSeconds(response.rem);
							$("#progressBar").width(100*(wid/total_length)+"%");
						});
					}
				}
			});
		}
	}
	setInterval(function(){ controlTime(false); }, 1000);
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.method == 'newSongRecieved'){
			getCurData();
		}
	});
	getCurData();
	controlTime(true);
	$("html").css("height", "120px");
});