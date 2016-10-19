var SimpleFormValidator = (function() {

	var errorDiv = '<div class="validation"><span class="error"></span></div>';

	var elementsArray = [];
	var eleNameArray = [];
	var errorCount = 0;
	var config = {
		errorHandler : {
			errorBgColor : 'red',
			errorMsgColor : 'red'
		}
	};

	var validate = function(cfg) {

		if (!isNull(cfg)) {

			$.extend(config, cfg);

			$('#' + config.formId).on('submit', function(event) {

				if (isNull(config.rules)) {
					config.rules = getFormConfigDetails(config.formId);
				}

				if (validateFormData(event, config) == 0) {

					if (!isNull(config.sucsuccessHandler))
						config.successHandler($('#' + config.formId));

				}
			});

		}

	}

	function getFormConfigDetails(formId) {

		var req = '';
		var msg = '';
		var len = '';

		var configDetails = [];

		$("form#" + formId + " .form-fields").each(function() {

			req = $(this).attr('req');
			msg = $(this).attr('msg');
			len = $(this).attr('len');

			configDetails.push({
				fieldName : $(this).attr('name'),
				required : req,
				message : msg,
				length : len
			});
			
			$(this).after(errorDiv);

		});

		return configDetails;
	}

	// ----------- Validation Functions ------------ //

	var validateFormData = function(event, config) {

		errorCount = 0;

		if (!isNull(event))
			event.preventDefault();

		// get all form inputs in array
		$("form#" + config.formId + " .form-fields").each(function() {
			
			elementsArray.push($(this));
			eleNameArray.push($(this).prop('name'));
		 
		});

		$.each(config.rules,
						function(i, rule) {

							var index = $.inArray(rule.fieldName, eleNameArray);

							if (index >= 0) {
								var ele = elementsArray[index];

								// validation logic 1 - null check
								if ((ele.val().trim() == "" && rule.required)
										|| (ele.prop('type') == 'radio'
												&& !ele.prop('checked') && rule.required)
										|| (ele.prop('type') == 'checkbox'
												&& !ele.prop('checked') && rule.required)) {
									showErrors(ele, true, rule.message);
									errorCount++;
								} else {
									showErrors(ele, false, rule.message);
								}

								// validation logic 2 - trim out value if
								// contain any spaces
								if (rule.trimed && ele.type == 'text')
									ele.val($.trim(ele.val()));

								// validation logic 3 - input length check
								if (ele.val().trim().length > rule.length
										&& ele.type == 'text') {
									showErrors(ele, true,
											'Field Length Exceeds to '
													+ ele.val().length
													+ ' expected is '
													+ rule.length + '.');
									errorCount++;
								}
							}
						});

		return errorCount;
	}

	function showErrors(ele, errorFlag, message) {
		if (errorFlag) {
			ele.css({
				"border-color" : config.errorHandler.errorBgColor
			});
			ele.next().show().find('.error').css({
				"color" : config.errorHandler.errorMsgColor
			}).html(message).show();

		} else {
			ele.css({
				"border-color" : ""
			});
			ele.next().hide();
		}
	}

	function isNull(property) {
		if (typeof (property) !== 'undefined') {
			return false;
		} else {
			return true;
		}
	}

	return {
		'validate' : validate
	}

}());
