const contactUsBtn = document.querySelector('#contactUs');
			const modalContactUs = new Custombox.modal({
			  content: {
			    effect: 'fadein',
			    target: '.modalContact'
			  }
			});
			const modalSuccess = new Custombox.modal({
			  content: {
			    effect: 'fadein',
			    target: '.modalSuccess'
			  }
			});
			const contactUsForm = {
				name: '',
				email: '',
				message: '',
			};

			document.addEventListener('click',closeModal);
			contactUsBtn.addEventListener('click', contactusClick);


			function closeModal(e) {
				if (e.target && e.target.className == 'closeIcon') {
			    	Custombox.modal.closeAll();
			    }
			}

			setTimeout( () => {
				buildFormsData();
				addSubmitEvent();
			}, 0);

			function contactusClick() {
				modalContactUs.open();
			}

			function buildFormsData() {
				var inputs = document.querySelectorAll('.formInput');
				inputs = [...inputs];

				inputs.map((input) => {
					input.addEventListener('input', (event) => {
						contactUsForm[event.target.name] = event.target.value;
					});
				});
			}

			function addSubmitEvent() {
				var submitBtn = document.querySelector('.contactSubmit');
				var errorElement = document.querySelector('.error');

				submitBtn.addEventListener('click', () => {
					fetch("../send.php", {
						method: "POST",
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
					  body: JSON.stringify(contactUsForm)
					}).then((response) => {
						if (response.status >= 400) {							
							errorElement.innerHTML = "Please, fill all fields";
						} else {
							errorElement.innerHTML = '';
							Custombox.modal.closeAll();
							modalSuccess.open();
						}
					});
				})
			}