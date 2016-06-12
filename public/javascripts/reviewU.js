
(function($){
	$(document).ready(function(){
		var $area = $('div.area');
		$('p a.detail').hide();
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
						'border': 'none',
						'font-size': '100%'
					})
					.find('a.detail')
						.fadeToggle(300);
			});		
	});
})(jQuery);