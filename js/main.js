/* intialize MaterializeCSS components */
var initCustomStylings = function() {
	/* create the side navigation */
	$(".button-collapse").sideNav();
	/* navigation menu dropdown init */
	$(".dropdown-button").dropdown();
	/* initialize modals */
	$('.modal').modal();
	
	/* add perfect-scroll to scrollable containers */
	$('.card-reveal').each(function() {
		new PerfectScrollbar(this);
	});
	$('.modal-content').each(function() {
		new PerfectScrollbar(this);
	});
};

/* send an API request to the platform */
var apiRequest = function(requestType, requestBody, requestPath, token) {
	var urlBase = '/api/v1/';
	
	var returnObject = {
		statusCode: null,
		response: null
	};
	
	$.ajax({
		async: false,
		cache: false,
		type: requestType,
		data: requestBody,
		dataType: 'application/json',
		headers: {
			'Auth-Token': token
		},
		error: function (xHR, status, error) {
			returnObject.statusCode = xHR.status;
			returnObject.response = JSON.parse(xHR.responseText);
		},
		success: function(result, status, xHR) {
			returnObject.statusCode = status;
			returnObject.response = result;
		},
		url: urlBase + requestPath,
	});
	
	/* automatically renew the token */
	if(returnObject.statusCode == 401) {
		var userData = loadUserData();
		var response = apiRequest("POST", userData, 'token', null);
		
		if(response.statusCode != 200) {
			console.log(response);
			
			return;
		}
		
		userData.token = response.response.token;
		saveUserData(userData);
		
		return apiRequest(requestType, requestBody, requestPath, userData.token);
	}
	
	return returnObject;
};

/* load the user data from the local storage */
var loadUserData = function () {
	return JSON.parse(localStorage.getItem("userData"));
};

/* save the user data into the local storage */
var saveUserData = function (userData) {
	localStorage.setItem("userData", JSON.stringify(userData));
};

/* request a new token from the platform */
var requestNewToken = function (userData) {
	return apiRequest("POST", userData, 'token', null);
};

/* request user data from the platform */
var requestUser = function (userData) {
	return apiRequest("GET", null, 'user/' + userData.id, userData.token);
};

var loadUser = function () {
	var userData = loadUserData();
	
	if(userData == null) {
		userData = {
			name: "user0",
			email: "user0@example.org",
			password: "password",
			token: null,
			id: null,
		}
	}
	
	if(userData.token == null) {
		response = requestNewToken(userData);
		
		if(response.statusCode == 200) {
			userData.token = response.response.token;
			userData.id = response.response.user_id;
		} else {
			console.log(response);
		}
	}
	
	saveUserData(userData);
	
	return userData;
};

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1];
        }
    }
};

loadUser();