// in-page script for when ad-block setting turned on

function sendConsoleMessage(m){
	chrome.runtime.sendMessage({method: 'mainscript', message: m}, function(response){} );
}

function applyCSS(){
	if ($(".MiniBar--rightRail").width() != $(window).width()){
		if (!!document.getElementsByClassName("App") && document.getElementsByClassName("App")[0] && $(".region-appBg").length>0){
			$(".MiniBar--rightRail").css("width", "100%");
			$(".region-topBar--rightRail").css("width", "100%");
			$(".region-main--rightRail").css("width", "100%");
			$(".region-bottomBar--rightRail").css("width", "100%");
			
			$(".AppBg__img--rightRail").css("width", "100%");
			
			$(".DisplayAdController").remove();
			
		}
		setTimeout(function(){ applyCSS(); }, 500);
	}
}

$(document).ready(function(){
	console.log("Fixing CSS from ad-block");
	applyCSS();
});