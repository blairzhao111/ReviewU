
(function($){
	var $area = $('div.area');
	$('p a.detail').hide();
	$area
		.on('mouseenter', function(){
			$(this).find('a.detail').fadeToggle(300);
		})
		.on('mouseleave', function(){
			$(this).find('a.detail').fadeToggle(300);
		});

})(jQuery);