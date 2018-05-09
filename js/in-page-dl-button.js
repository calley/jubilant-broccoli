/*var SongTitle, SongArtist, SongAlbum, SongLink;

function injectHTML(){
    if(!!$("#downloadLink") && $("#downloadLink").length==0){
        var imgURL = chrome.extension.getURL("photos/downloadIcon.png");
        var downloadButtonURL = chrome.extension.getURL("html/downloadButton.html");
        $.get(downloadButtonURL, function(data) {
        	if (!!$("#downloadLink") && $("#downloadLink").length==0){
				$('#trackInfoButtons').children().first().append(data);
				$('.downloadButton div.icon').css('background-image',"url(\""+imgURL+"\")");
				buttonClicked();
			}
        });
    }
}

function buttonClicked(){
	document.getElementById("downloadLink").onclick = function(){
		chrome.runtime.sendMessage({method: 'openDLPage'}, function(response){} );
	}
}

injectHTML();
*/