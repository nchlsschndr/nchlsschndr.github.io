$(document).ready(function() {
	function filterPath(string) {
	return string
		.replace(/^\//,'')
		.replace(/(index|default).[a-zA-Z]{3,4}$/,'')
		.replace(/\/$/,'');
	}
	var locationPath = filterPath(location.pathname);
	var scrollElem = scrollableElement('html', 'body');
 
	$('a[href*=#]').each(function() {
		var thisPath = filterPath(this.pathname) || locationPath;
		if (  locationPath == thisPath
		&& (location.hostname == this.hostname || !this.hostname)
		&& this.hash.replace(/#/,'') ) {
			var $target = $(this.hash), target = this.hash;
			if (target) {
				var targetOffset = $target.offset().top;
				$(this).click(function(event) {
					event.preventDefault();
					$(scrollElem).animate({scrollTop: targetOffset}, 400, function() {
						location.hash = target;
					});
				});
			}
		}
	});
 
	// use the first element that is "scrollable"
	function scrollableElement(els) {
		for (var i = 0, argLength = arguments.length; i <argLength; i++) {
			var el = arguments[i],
					$scrollElement = $(el);
			if ($scrollElement.scrollTop()> 0) {
				return el;
			} else {
				$scrollElement.scrollTop(1);
				var isScrollable = $scrollElement.scrollTop()> 0;
				$scrollElement.scrollTop(0);
				if (isScrollable) {
					return el;
				}
			}
		}
		return [];
	}
	// Get a reference to the <path>
	var path = document.querySelector('#star-path');

	// Get length of path... ~577px in this case
	var pathLength = path.getTotalLength();

	// Make very long dashes (the length of the path itself)
	path.style.strokeDasharray = pathLength + ' ' + pathLength;

	// Offset the dashes so the it appears hidden entirely
	path.style.strokeDashoffset = pathLength;

	// Jake Archibald says so
	// https://jakearchibald.com/2013/animated-line-drawing-svg/
	path.getBoundingClientRect();

	// When the page scrolls...
	window.addEventListener("scroll", function(e) {
	 
	  // What % down is it? 
	  // https://stackoverflow.com/questions/2387136/cross-browser-method-to-determine-vertical-scroll-percentage-in-javascript/2387222#2387222
	  // Had to try three or four differnet methods here. Kind of a cross-browser nightmare.
	  var scrollPercentage = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
	    
	  // Length to offset the dashes
	  var drawLength = pathLength * scrollPercentage;
	  
	  // Draw in reverse
	  path.style.strokeDashoffset = pathLength - drawLength;
	  
	});
});