
(function($){
	$(document).ready(function(){
		var $area = $('div.area'),
			$searchMore = $('#searchMore'),
			$searchPanel = $('#searchPanel'),
			$footer = $('#footer'),
			$searchSpan = $searchMore.children('span');
			borderDefault = $area.css('border');

		$('p a.detail').hide();
		$searchPanel.hide();

/*		if ($("body").height() > $(window).height()) {
	        $footer.hide();
	    }*/
		
		//button for closing up list-page's jumbotron 
		$('button.close').on('click', function(){
			$('#banner').slideUp(1000);
			$(this).hide();
		});

		//highlight current pointing area and show detail button
		$area
			.on('mouseenter', function(){
				$(this)
					.css({
						'border': '5px solid #ff0066',
						'font-size': '135%'
					})
					.find('a.detail')
						.fadeToggle(300);
			})
			.on('mouseleave', function(){
				$(this)
					.css({
						'border': borderDefault,
						'font-size': '100%'
					})
					.find('a.detail')
						.fadeToggle(100);
			});

		$searchMore
			.on('click', function(){
				$searchPanel.slideToggle(300);
				if($searchSpan.hasClass('glyphicon-menu-down')){
					$searchSpan.removeClass('glyphicon-menu-down');
					$searchSpan.addClass('glyphicon-menu-up');
				}else{
					$searchSpan.removeClass('glyphicon-menu-up');
					$searchSpan.addClass('glyphicon-menu-down');
				}
			});

/*		window.onscroll = function(ev) {
		    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
		        $footer.fadeToggle(1500);
		    }else{
		    	$footer.hide();
		    }
		};*/

	});
})(jQuery);