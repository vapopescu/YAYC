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
  var userData = JSON.parse(localStorage.getItem("userData"));

  if (userData == null) {
    console.log("Not logged in");
    window.location.replace("login.html");
  }

  return userData;
};

/* save the user data into the local storage */
var saveUserData = function (userData) {
  localStorage.setItem("userData", JSON.stringify(userData));
};

/* delete the user data from the local storage */
var deleteUserData = function () {
  localStorage.removeItem("userData");
  console.log("Signed out:");
  console.log("User details: " + localStorage.getItem("userData"));
};

var getUrlParameter = function getUrlParameter(param) {
  var pageURL = decodeURIComponent(window.location.search.substring(1));
  var urlVariables = pageURL.split('&');

  for (var i = 0; i < urlVariables.length; i++) {
    var parameterName = urlVariables[i].split('=');

    if (parameterName[0] === param) {
      return parameterName[1];
    }
  }
};
