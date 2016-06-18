
(function($){
	$(document).ready(function(){
		var $area = $('div.area'),
			$searchMore = $('#searchMore'),
			$searchPanel = $('#searchPanel'),
			$footer = $('#footer'),
			$searchSpan = $searchMore.children('span'),
			$list = $('div#list'),
			borderDefault = $area.css('border');

		if($list.length > 0){
			var $tab = $list.find('ul#tab'),
				$restList = $list.find('div#restaurant-list'),
				$barList = $list.find('div#barcafe-list').hide(),
				$shopList = $list.find('div#shopping-list').hide(),
				$serviceList = $list.find('div#service-list').hide(),
				$othersList = $list.find('div#others-list').hide(),
				$restTab = $tab.find('a#rest-tab'),
				$barTab = $tab.find('a#bar-tab'),
				$shopTab = $tab.find('a#shop-tab'),
				$serviceTab = $tab.find('a#service-tab'),
				$othersTab = $tab.find('a#others-tab'),
				$currentTab = $restTab,
				$currentList = $restList;

			$restTab.on('click', function(event){
				event.preventDefault();
				if($currentTab === $restTab){return;}
				$currentList.hide();
				$currentTab.parent('li').removeClass('active');
				$currentTab = $restTab;
				$currentList = $restList;
				$currentList.fadeIn(800);
				$currentTab.parent('li').addClass('active');
			});

			$barTab.on('click', function(event){
				event.preventDefault();
				if($currentTab === $barTab){return;}
				$currentList.hide();
				$currentTab.parent('li').removeClass('active');
				$currentTab = $barTab;
				$currentList = $barList;
				$currentList.fadeIn(800);
				$currentTab.parent('li').addClass('active');
			});

			$shopTab.on('click', function(event){
				event.preventDefault();
				if($currentTab === $shopTab){return;}
				$currentList.hide();
				$currentTab.parent('li').removeClass('active');
				$currentTab = $shopTab;
				$currentList = $shopList;
				$currentList.fadeIn(800);
				$currentTab.parent('li').addClass('active');				
			});

			$serviceTab.on('click', function(event){
				event.preventDefault();
				if($currentTab === $serviceTab){return;}
				$currentList.hide();
				$currentTab.parent('li').removeClass('active');
				$currentTab = $serviceTab;
				$currentList = $serviceList;
				$currentList.fadeIn(800);
				$currentTab.parent('li').addClass('active');				
			});

			$othersTab.on('click', function(event){
				event.preventDefault();
				if($currentTab === $othersTab){return;}
				$currentList.hide();
				$currentTab.parent('li').removeClass('active');
				$currentTab = $othersTab;
				$currentList = $othersList;
				$currentList.fadeIn(800);
				$currentTab.parent('li').addClass('active');				
			});
		}

		//pages starting state
		$('p a.detail').hide();
		$searchPanel.hide();

/*		if ($("body").height() > $(window).height()) {
	        $footer.hide();
	    }*/
		
		//button for closing up list-page's jumbotron 
		$('button#closeJumbotron').on('click', function(){
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

		//slideToggle search panel
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