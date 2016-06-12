
(function($){
	$(document).ready(function(){
		var $area = $('div.area'),
			$searchMore = $('#searchMore'),
			$searchPanel = $('#searchPanel'),
			borderDefault = $area.css('border');

		$('p a.detail').hide();
		$searchPanel.hide();

		$area
			.on('mouseenter', function(){
				$(this)
					.css({
						'border': '4px solid #CCC',
						'font-size': '130%'
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
						.fadeToggle(300);
			});

		$searchMore
			.on('click', function(){
				$searchPanel.slideToggle(300);
			});	
	});
})(jQuery);