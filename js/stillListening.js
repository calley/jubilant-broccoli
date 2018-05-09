stillListening();
function stillListening(){
	if (!!document.querySelector("button[data-qa='keep_listening_button']")){
		console.log("keep-listening-button clicked");
		document.querySelector("button[data-qa='keep_listening_button']").click();
	};
	setTimeout(stillListening,6000);
}

/*function wait(){
	if (!!document.getElementsByClassName("Container") && !!document.getElementsByClassName("Container")[0]){
		listener = document.getElementsByClassName("Container")[0].addEventListener("DOMSubtreeModified", function(e) {
			if (!!e.target.getAttribute("data-qa") && e.target.getAttribute("data-qa")=="'keep_listening_button'"){
				if (!!document.querySelector("button[data-qa='keep_listening_button']")){
					console.log("keep-listening-button clicked");
					document.querySelector("button[data-qa='keep_listening_button']").click();
				};
			}
		}, false);
	} else {
		setTimeout(function(){ wait(); }, 500);
	}
}

wait();
*/
