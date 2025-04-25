//Hook up the tweet display

$(document).ready(function() {
						   
	$(".countdown").countdown({
				date: "1 may 2025 12:00:00",
				format: "on"
			},
			
			function() {
				// callback function
			});

});	