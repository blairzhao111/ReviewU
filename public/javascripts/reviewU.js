
(function($){
	$(document).ready(function(){
		var $area = $('div.area'),
			$searchMore = $('#searchMore'),
			$searchPanel = $('#searchPanel'),
			borderDefault = $area.css('border');

		$('p a.detail').hide();
		$searchPanel.hide();

		$('button.close').on('click', function(){
			$('#banner').slideUp(1000);
			$(this).hide();
		});

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
						.fadeToggle(300);
			});

		$searchMore
			.on('click', function(){
				$searchPanel.slideToggle(300);
			});	

	});
})(jQuery);