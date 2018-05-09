$(document).ready(function(){
	var advanced_options = JSON.parse(localStorage["PandoraAdvPreferences"]);
	function on(t){
		if ($("#autoDL").is(':checked')){ advanced_options[0] = true; } else { advanced_options[0] = false; };
		if ($("#customData").is(':checked')){ advanced_options[1] = true; } else { advanced_options[1] = false; };
		advanced_options[2] = $("#nameFormat").val();
		localStorage["PandoraAdvPreferences"] = JSON.stringify(advanced_options);
		if (t){
			reloadDLPage();
		}
	}
	
	function reloadDLPage(){
		chrome.runtime.sendMessage({method: 'reloadDLPage'}, function(response){});
	}
	
	function printCustomData(){
		var sample = $("#nameFormat").val();
		while (sample.indexOf("*s") > -1){
			sample = sample.replace("*s", "Billie Jean");
		}
		while (sample.indexOf("*a") > -1){
			sample = sample.replace("*a", "Michael Jackson");
		}
		while (sample.indexOf("*l") > -1){
			sample = sample.replace("*l", "Thriller");
		}
		$("#curForm").html(sample);
	}
	
	$("#autoDL").prop('checked', advanced_options[0]);
	$("#customData").prop('checked',advanced_options[1]);
	$("#nameFormat").val(advanced_options[2]);
	
	if (!advanced_options[1]){
		$('#customName').hide();
	}
	
	on(false);
	printCustomData();
	window.onbeforeunload = function(){ on(false); }
	
	$('#autoDL').change(function(){
		on(false);
    });
	$('#customData').change(function(){
        if($(this).is(":checked")){
            $('#customName').fadeIn();
        } else {
			$('#customName').fadeOut();
		}
		on(true);
    });
    $("#nameFormat").blur(function(){
    	printCustomData();
    	on(true);
    });
});