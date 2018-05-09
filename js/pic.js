var root = "../photos/back";
var num_photos = 6;
var previous_photos = [];

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillphotos(){
	for (var i = 0; i<num_photos; i++){
		previous_photos[i] = String(i+1);
		console.log(previous_photos[i]);
	}
}

$(document).ready(function(){
	if (localStorage["pandoraEphotos"]==undefined){
		fillphotos();
		localStorage["pandoraEphotos"] = JSON.stringify(previous_photos);
	} else {
		previous_photos = JSON.parse(localStorage["pandoraEphotos"]);
	}
	var ran_n = getRandomInt(0,previous_photos.length-1);
	var ran_number = previous_photos[ran_n];
	previous_photos.splice(ran_n,1);
	if (previous_photos.length==0){
		fillphotos();
	}
	localStorage["pandoraEphotos"] = JSON.stringify(previous_photos);
	$('body').css('background-image','url('+root+ran_number+'.jpg)');
	//$('body').css('background-image','url(welcome.jpg)')
});