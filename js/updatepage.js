$(document).ready(function(){

	var temp = document.getElementsByClassName("row");
	var cur = 0;
	var switchspeed = 1000;
	var normImg = 10;
	var bigImg = 15;
	
	for (var i=1; i<temp.length; i=i+1){
		$(".row").eq(i).hide();
	}
	
	for (var i=0; i<temp.length; i++){
		$("#circles").append("<img class='f_status' src='../photos/grey.png'></img>");
	}
	$(".f_status").eq(0).attr("src","../photos/black.png");
	$(".f_status").eq(0).width(15);
	$(".f_status").eq(0).height(15);
	
	function switcheroo(){	
		$(".row").eq(cur).hide('slide', {direction: 'right'}, switchspeed);
		$(".f_status").eq(cur).attr("src","../photos/grey.png");
		$(".f_status").eq(cur).width(normImg);
		$(".f_status").eq(cur).height(normImg);
		
		if (cur+1<temp.length){
			$(".row").eq(cur+1).show('slide', {direction: 'left'}, switchspeed);
			$(".f_status").eq(cur+1).attr("src","../photos/black.png");
			$(".f_status").eq(cur+1).width(bigImg);
			$(".f_status").eq(cur+1).height(bigImg);
			cur=cur+1;
		} else {
			$(".row").eq(0).show('slide', {direction: 'left'}, switchspeed);
			$(".f_status").eq(0).attr("src","../photos/black.png");
			$(".f_status").eq(0).width(bigImg);
			$(".f_status").eq(0).height(bigImg);
			cur=0;
		}
	}
	setInterval(function(){ switcheroo(); },8000);
	
});