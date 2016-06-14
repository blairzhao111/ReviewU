
(function($){
	$(document).ready(function(){

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