
(function($){
	$(document).ready(function(){

		var $searchForm = $('form#search'),
			$advSearchForm = $('form#advSearch'),
			$newLocationForm = $('form#newLocationPost'),
			$loginForm = $('form#login'),
			$registerForm = $('form#register'),
			$messageForm = $('form#messageMe');

		//helper functions
		var invalidCoords = function(coords){
			var lng = coords[0],
				lat = coords[1];

			lng = parseFloat(lng);
			lat = parseFloat(lat);

			if(lng<-180||lng>180||lat<-90||lat>90){
				return true;
			}

			return false;
		};

		var checkLocationInfo = function(info){
			if(!info.name||!info.address||!info.category||!info.coords[0]||!info.coords[1]||!info.openingTimes[0]||!info.openingTimes[1] || !info.openingTimes[2]){
				return "Please fill in all fields and try again!";
			}else if(invalidCoords(info.coords)){
				return "Please enter valid coordinates and try again!";
			}else{
				return null;
			}
		};

		var checkLoginInfo = function(email, ps){
			var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

			if(!email || !ps){
				return "Please fill in all fields and try again!";
			}else if(!(email.toString().match(emailPattern))){
				return "Invalid email, please check and try again!";
			}else{
				return null;
			}
		};

		var checkRegisterInfo = function(email, name, ps, ps2){
			var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

			if(!email || !name || !ps || !ps2){
				return "Please fill in all fields and try again!";
			}else if(!(email.toString().match(emailPattern))){
				return "Invalid email, please check and try again!";
			}else if(ps.toString() !== ps2.toString()){
				return "Password and verify password are different, please check and try again!";
			}else {
				return null;
			}		
		};

		var checkMessageInfo = function(name, email, text){
			var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

			if(!name || !email || !text){
				return "Please fill in all fields and try again!";
			}else if(!email.match(emailPattern)){
				return "Invalid email format, please check and try again!";
			}else{
				return null;
			}
		};

		//validation handlers
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

				if(!$this.find('select#rating').val() || !$this.find('textarea#reviewText').val()){
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

		//add new location form validation
		$newLocationForm.on('submit', function(event){
			var $this = $(this),
				data = {
					name: $this.find('input[name="name"]').val(),
					address: $this.find('input[name="address"]').val(),
					coords: [
						$this.find('input[name="lng"]').val(),
						$this.find('input[name="lat"]').val()
						],
					category: $this.find('select[name="category"]').val(),
					openingTimes: [
						$this.find('input[name="open-week"]').val(),
						$this.find('input[name="open-sat"]').val(),
						$this.find('input[name="open-sun"]').val()
						],
					facilities: $this.find('textarea').val().trim().split(',')
				},
				$alert = $this.find('div#postError'),
				message = null;

			if($alert.length > 0){$alert.hide();}

			message = checkLocationInfo(data);
			if(message){
				event.preventDefault();
				if($alert.length > 0){
					$alert.text(message);
					$alert.show();
				}else{
					$('<div id="postError" class="alert alert-danger" role="alert">'+message+'</div>')
						.prependTo($this.find('div.modal-body'));						
				}

				return false;
			}

			return true;
		});

		//login form validation
		$loginForm.on('submit', function(event){
			var $this = $(this),
				email = $this.find('input[name="email"]').val(),
				ps = $this.find('input[name="ps"]').val(),
				$alert = $this.find('div#loginError'),
				message = null;

			if($alert.length > 0){$alert.hide();}

			message = checkLoginInfo(email, ps);
			if(message){
				event.preventDefault();
				if($alert.length > 0){
					$alert.text(message);
					$alert.show();
				}else{
					$('<div id="loginError" class="alert alert-danger" role="alert">'+message+'</div>')
						.prependTo($this.find('div.modal-body'));						
				}
				return false;
			}
			return true;
		});

		//register form validation
		$registerForm.on('submit', function(event){
			var $this = $(this),
				email = $this.find('input[name="email"]').val(),
				name = $this.find('input[name="name"]').val(),
				ps = $this.find('input[name="ps"]').val(),
				ps2 = $this.find('input[name="ps2"]').val(),
				$alert = $this.find('div#registerError'),
				message = null;

			if($alert.length > 0){$alert.hide();}

			message = checkRegisterInfo(email, name, ps, ps2);
			if(message){
				event.preventDefault();
				if($alert.length > 0){
					$alert.text(message);
					$alert.show();
				}else{
					$('<div id="registerError" class="alert alert-danger" role="alert">'+message+'</div>')
						.prependTo($this.find('div.modal-body'));						
				}
				return false;
			}
			return true;
		});

		//message form validation
		$messageForm.on('submit', function(event){
			var $this = $(this),
				name = $this.find('input[name="name"]').val().toString(),
				email = $this.find('input[name="email"]').val().toString(),
				messageText = $this.find('textarea').val().toString(),
				$alert = $this.find('div#messageMeError'),
				message = null;

			if($alert.length > 0){$alert.hide();}

			message = checkMessageInfo(name, email, messageText);
			if(message){
				event.preventDefault();
				if($alert.length>0){
					$alert.text(message);
					$alert.show();
				}else{
					$('<div id="messageMeError" class="alert alert-danger" role="alert">'+message+'</div>')
						.prependTo($this.find('div.modal-body'));						
				}
				return false;
			}
			return true;	
		});

	});
})(jQuery);