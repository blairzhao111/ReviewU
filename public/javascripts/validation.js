
(function($){
	$(document).ready(function(){

		var $searchForm = $('form#search'),
			$advSearchForm = $('form#advSearch');

		//simple search form validation
		$searchForm.on('submit', function(event){
			var $input = $searchForm.children('input'),
				$alert = $searchForm.siblings('div#searchError');

			if($alert.length>0){$alert.hide();}

			if(!$input.val()){
				event.preventDefault();
				if($alert.length>0){
					$alert.show();
				}else{
					$('<div id="searchError" class="alert alert-danger" role="alert">Please fill in field and try again!</div>')
						.insertBefore($searchForm);						
				}
				return false;
			}
			return true;
		});

		//advance search form validation
		$advSearchForm.on('submit', function(event){
			var $name = $advSearchForm.find('input[name="name"]'),
				$distance = $advSearchForm.find('select[name="maxdis"]'),
				$category = $advSearchForm.find('select[name="category"]'),
				$ratingDir = $advSearchForm.find('select[name="ratingDir"]'),
				$ratingVal = $advSearchForm.find('select[name="ratingVal"]'),
				$alert = $advSearchForm.siblings('div#advSearchError');

			if(!$name.val() && !$distance.val() && !$category.val() && !($ratingDir.val()&&$ratingVal.val())){
				event.preventDefault();
				if($alert.length>0){
					$alert.show();
				}else{
					$('<div id="advSearchError" class="alert alert-danger" role="alert">Please fill in at least one field section and try again!</div>')
						.insertBefore($advSearchForm);						
				}				
				return false;
			}
			return true;
		});

		//review form validation
		$('form#addReview')
			.on('submit', function(event){
				//this refers to entire form element
				var $this = $(this),
					$alert = $this.find('div#reviewError');

				if($alert.length > 0){$alert.hide();}

				if(!$this.find('input#name').val() || !$this.find('select#rating').val() 
					|| !$this.find('textarea#reviewText').val()){
					event.preventDefault();
					if($alert.length > 0){
						$alert.show();
					}else{
						$('<div id="reviewError" class="alert alert-danger" role="alert">Please fill in all required fields and try again!</div>')
							.prependTo($this);						
					}
					return false;
				}

				return true;
			});
	});
})(jQuery);