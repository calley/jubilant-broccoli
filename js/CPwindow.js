var clean = [["&amp;","&"],["/n","</br>"]];

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
	var shortnd = String(str);
	if (shortnd.length > lent){
		shortnd = (shortnd.slice(0,lent-1))+"...";
	}
	return shortnd;
}

$(document).ready(function(){
	// pref = [length,skip,like,dislike,notify,adblock];
	
	$("body").css({"width": "310px"});
	document.title = "Pandora Enhancer";
	var pref = JSON.parse(localStorage["PandoraNEWPreferences"]);
	var colors = JSON.parse(localStorage["PandoraCustomColors"]);
	var downloadOnClick = JSON.parse(localStorage["PandoraDownloadOnClickk"]);
	
	
	function on(){
		if ($("#toggleColorPicker").is(':checked')){ pref[7] = true; } else { pref[7] = false; };
		localStorage["PandoraNEWPreferences"] = JSON.stringify(pref);
		chrome.tabs.query({}, function(tabs){
			for (var i=0; i<tabs.length; ++i){
				chrome.tabs.sendMessage(tabs[i].id, {action: "settingsChangedReq"}, function(response){});
			}
		});
	}
	function tryToUpdate(){
		on();
	}
	
	$("#toggleColorPicker").prop('checked',pref[7]);

	if (!pref[7]){ $('#colorPickContainer').hide(); $("#colorResetBtn").hide(); }
	
	tryToUpdate();
	window.onbeforeunload = function(){ tryToUpdate(); }
    
    function sendColorUpdateToPage(enabled){
    	chrome.tabs.query({}, function(tabs){
			for (var i=0; i<tabs.length; ++i){
				chrome.tabs.sendMessage(tabs[i].id, {action: "update_colors"}, function(response){});
			}
		});
	}
    
    $('#toggleColorPicker').change(function(){
        if($(this).is(":checked")){
            $('#colorPickContainer').fadeIn();
            $("#colorResetBtn").show();
        } else {
			$('#colorPickContainer').fadeOut();
			$("#colorResetBtn").hide();
		}
		sendColorUpdateToPage();
		tryToUpdate();
    });
	
	// https://labs.abeautifulsite.net/jquery-minicolors/
	
	function showColors(){
		var holders = $(".minicolors-input");
		if (holders.length == colors.length-1){
			for (var i = 0; i<holders.length; i++){
				$(holders[i]).attr("value", colors[i]);
				var tmp = colors[i].split(",");
				$($($(holders[i]).parent().parent()).find(".colorBoxAlex")[0]).css({"opacity": (tmp.length == 3 ? 1 : tmp[3].slice(1,tmp[3].length-1)), "background-color": colors[i]});
			}
			$("#backgroundImgOpac").attr("value", colors[5]);
		} else {
			console.log("Wrong number of colors stored", colors, localStorage["PandoraCustomColors"]);
		}
	}
	showColors();
	
	function saveColors(){
		var holders = $(".minicolors-input");
		if (holders.length == colors.length-1){
			for (var i = 0; i<holders.length; i++){
				colors[i] = $(holders[i]).attr("value");
			}
			colors[5] = $("#backgroundImgOpac").val();
			localStorage["PandoraCustomColors"] = JSON.stringify(colors);
			chrome.tabs.query({}, function(tabs){
				for (var i=0; i<tabs.length; ++i){
					chrome.tabs.sendMessage(tabs[i].id, {action: "update_colors"}, function(response){});
				}
			});
		} else {
			console.log("Wrong number of colors stored");
		}
	}
	
	$(".minicolors-input").change(function(){
		saveColors();
	});
	
	$("#backgroundImgOpac").change(function(){
		saveColors();
	});
	
	$("#colorResetBtn").click(function(){
		colors = JSON.parse(localStorage["defaultColorSettings"]);
		localStorage["PandoraCustomColors"] = localStorage["defaultColorSettings"];
		showColors();
		sendColorUpdateToPage();
	});
	
	$(".demo").minicolors({
		animationSpeed: 50,
		animationEasing: 'swing',
		change: function(hex, opacity) {
			var log;
			try {
				log = hex ? hex : 'transparent';
				$($($(this).parent().parent()).find(".colorBoxAlex")[0]).css({"opacity": opacity, "background-color": log});
				$(this).attr("value", log);
				if( opacity ) log += ', ' + opacity;
				console.log(log);
			} catch(e) {}
		},
		changeDelay: 0,
		control: 'hue',
		defaultValue: '',
		format: 'rgb',
		hide: null,
		hideSpeed: 100,
		inline: false, // try changing
		keywords: '',
		letterCase: 'lowercase',
		opacity: true,
		position: 'bottom left',
		show: null,
		showSpeed: 100,
		theme: 'default',
		swatches: []
	});
	
	$(".demo1").minicolors({
		animationSpeed: 50,
		animationEasing: 'swing',
		change: function(hex, opacity) {
			var log;
			try {
				log = hex ? hex : 'transparent';
				$($($(this).parent().parent()).find(".colorBoxAlex")[0]).css({"opacity": opacity, "background-color": log});
				$(this).attr("value", log);
				$(this).attr("value", log);
				if( opacity ) log += ', ' + opacity;
				console.log(log);
			} catch(e) {}
		},
		changeDelay: 0,
		control: 'hue',
		defaultValue: '',
		format: 'rgb',
		hide: null,
		hideSpeed: 100,
		inline: false, // try changing
		keywords: '',
		letterCase: 'lowercase',
		opacity: false,
		position: 'bottom left',
		show: null,
		showSpeed: 100,
		theme: 'default',
		swatches: []
	});
	
	$(window).blur(function() {
		window.close();
    });
	
});


