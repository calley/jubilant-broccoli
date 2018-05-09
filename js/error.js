/*var elap = document.getElementsByClassName("elapsedTime")[0].innerHTML;

function sendConsoleMessage(m){
	chrome.runtime.sendMessage({method: 'mainscript', message: m}, function(response){} );
}

function checkTimeChanged(check1,check2){
	if (document.getElementsByClassName("elapsedTime")[0].innerHTML == elap){
		if (!!(document.getElementsByClassName("pauseButton")[0]) && document.getElementsByClassName("pauseButton")[0].style.display=="block" && !!(document.getElementsByClassName("playerBarArt")[0])){
			if (check1){
				sendConsoleMessage("- pandora may be frozen -");
				setTimeout(function (){ checkTimeChanged(false,true); },5000);
			} else if (check2){
				sendConsoleMessage("FROZEN- reloading page");
				window.location.reload();
			} else {
				setTimeout(function (){ checkTimeChanged(true,false); },5000);
			}
		} else {
			elap = document.getElementsByClassName("elapsedTime")[0].innerHTML;
		}
	} else {
		elap = document.getElementsByClassName("elapsedTime")[0].innerHTML;
	}
}

setInterval(function(){ checkTimeChanged(false,false); }, 5000);*/