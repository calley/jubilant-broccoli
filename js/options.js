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
	
	document.title = "Options";
	var pref = JSON.parse(localStorage["PandoraNEWPreferences"]);
	var colors = JSON.parse(localStorage["PandoraCustomColors"]);
	var downloadOnClick = JSON.parse(localStorage["PandoraDownloadOnClickk"]);
	
	var OSName="Unknown OS";
	if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
	if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
	if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
	if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
	
	$("#macNotiWarnTxt").hide();
	if (OSName=="MacOS"){
		$("#macNotiWarnBtn").click(function(){
			if ($("#macNotiWarnTxt").is(":visible")){
				$("#macNotiWarnTxt").fadeOut();
				$("#macNotiWarnBtn").html("MaOS users announcement (show)");
			} else {
				$("#macNotiWarnTxt").fadeIn();
				$("#macNotiWarnBtn").html("MaOS users announcement (hide)");
			}
		});
	} else {
		$("#macNotiWarnBtn").hide();
	}
	
	function on(){
		pref[0] = $("#NotiLen").val();
		if ($("#skipOnClick").is(':checked')){ pref[1] = true; } else { pref[1] = false; };
		if ($("#likeOnClick").is(':checked')){ pref[2] = true; } else { pref[2] = false; };
		if ($("#dislikeOnClick").is(':checked')){ pref[3] = true; } else { pref[3] = false; };
		if ($("#toggleNoti").is(':checked')){ pref[4] = true; } else { pref[4] = false; };
		if ($("#toggleAdBlock").is(':checked')){ pref[5] = true; } else { pref[5] = false; };
		if ($("#toggleRUSTILL").is(':checked')){ pref[6] = true; } else { pref[6] = false; };
		if ($("#toggleColorPicker").is(':checked')){ pref[7] = true; } else { pref[7] = false; };
		localStorage["PandoraNEWPreferences"] = JSON.stringify(pref);
		chrome.tabs.query({}, function(tabs){
			for (var i=0; i<tabs.length; ++i){
				chrome.tabs.sendMessage(tabs[i].id, {action: "settingsChangedReq"}, function(response){});
			}
		});
	}
	function tryToUpdate(){
		if ($("#NotiLen").val()!==""){ on(); } else { $("#NotiLen").css('background-color', '#FF3333'); $("#NotiLen").val('Enter a Value'); };
	}
	
	$("#NotiLen").val(pref[0]);
	$("#skipOnClick").prop('checked',pref[1]);
	$("#likeOnClick").prop('checked',pref[2]);
	$("#dislikeOnClick").prop('checked',pref[3]);
	$("#toggleNoti").prop('checked',pref[4]);
	$("#toggleAdBlock").prop('checked',pref[5]);
	$("#toggleRUSTILL").prop('checked',pref[6]);
	$("#toggleColorPicker").prop('checked',pref[7]);
	$("#NotiLen").val(pref[0]);
	$("#toggleTheme").prop('checked',localStorage['showCustomBackground']=="1");
	
	if (!pref[4]){ $('#showNoti').hide(); }
	if (!pref[1] || pref[2]){ $('#options1').hide(); }
	if (!pref[7]){ $('#colorPickContainer').hide(); $("#colorResetBtn").hide(); }
	
	tryToUpdate();
	window.onbeforeunload = function(){ tryToUpdate(); }
	
	$('#openN').click(function(){
		chrome.runtime.sendMessage({method: 'openPandora'}, function(response){} );
	});
	
	$('#toggleNoti').change(function(){
        if($(this).is(":checked")){
            $('#showNoti').fadeIn();
        } else {
			$('#showNoti').fadeOut();
		}
		tryToUpdate();
    });
    
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
    
    $('#toggleAdBlock').change(function(){
    	chrome.runtime.sendMessage({method: 'changeAdSettingConfirm'}, function(response){} );
    });
    
    $('#toggleRUSTILL').change(function(){
    	chrome.runtime.sendMessage({method: 'changeRUSettingConfirm'}, function(response){} );
    });
    
	$('#skipOnClick').change(function(){
        if($(this).is(":checked")){
            $("#likeOnClick").prop('checked',false);
			$('#options1').fadeIn();
        } else {
			$("#dislikeOnClick").prop('checked',false);
			$('#options1').fadeOut();
		}
		tryToUpdate();
    });
    
	$('#likeOnClick').change(function(){
        if($(this).is(":checked")){
            $("#skipOnClick").prop('checked',false);
			$("#dislikeOnClick").prop('checked',false);
			$('#options1').fadeOut();
        };
        tryToUpdate();
    });
    
    $('#dislikeOnClick').change(function(){
        tryToUpdate();
    });
    
	$('#NotiLen').focus(function(){
		$(this).css('background-color','#FFFFFF');
		$(this).val("");
	});
	
	$("#NotiLen").keydown(function (e){
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) { return; };
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) { e.preventDefault(); };
    });
    
    $("#NotiLen").blur(function(){
    	if ($(this).val()==""){
    		$(this).val(pref[0]);
    	} else {
    		tryToUpdate();
    	}
    });
    
    if (localStorage['background_select']==undefined || localStorage['showCustomBackground']==undefined){
    	localStorage['showCustomBackground'] = "0";
    	localStorage['background_select'] = "none";
    }
    
    if ((localStorage['showCustomBackground']=="0")){ $('#BackgroundSelectionDiv').hide(); };
    $('#BackgroundSelector').val(localStorage['background_select']);
    
    $('#toggleTheme').change(function(){
        if($(this).is(":checked")){
			$('#BackgroundSelectionDiv').fadeIn();
			localStorage['showCustomBackground'] = "1";
        } else {
			$('#BackgroundSelectionDiv').fadeOut();
			localStorage['showCustomBackground'] = "0";
		}
		chrome.runtime.sendMessage({method: 'change_background'}, function(response){} );
    });
    
    $('#BackgroundSelector').change(function(){
		switch ($(this).val()){
			case "none":
				localStorage['custom_backgorund'] = "";
				localStorage['showCustomBackground'] = "0";
				$("#toggleTheme").prop('checked',false);
				$('#BackgroundSelectionDiv').fadeOut();
				break;
			case "dj":
				localStorage['custom_backgorund'] = chrome.extension.getURL("photos/welcome.jpg");
				break;
			case "beach":
				localStorage['custom_backgorund'] = chrome.extension.getURL("photos/back5.jpg");;
				break;
			case "city":
				localStorage['custom_backgorund'] = chrome.extension.getURL("photos/city.jpg");;
				break;
			case "light":
				localStorage['custom_backgorund'] = chrome.extension.getURL("photos/blur.jpg");;
				break;
		}
		localStorage['background_select'] = $(this).val();
		chrome.runtime.sendMessage({method: 'change_background'}, function(response){} );
    });

	var input = document.getElementById('uploadImage');
	input.onchange = function(evt){
		var tgt = evt.target || window.event.srcElement, 
		files = tgt.files;

		if (FileReader && files && files.length) {
			var fr = new FileReader();
			$("#BackgroundSelector").val("none");
			localStorage['background_select'] = "none";
			fr.onload = function () {
				localStorage['custom_backgorund'] = fr.result;
			}
			fr.readAsDataURL(files[0]);
			chrome.runtime.sendMessage({method: 'change_background'}, function(response){} );
		} else {
			alert("Error in file submission- your browser may not support FileReader.api");
		}
	}
	
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
	
	$(window).focus(function() {
		location.reload(); 
    });
	
});


