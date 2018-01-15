/* Global Variables */
var userData = null;

/* send an API request to the platform */
var apiRequest = function(requestType, requestBody, requestPath, token) {
  var urlBase = 'http://vps500832.ovh.net/api/v1/';

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

/* send a form bodied API request to the platform */
var apiFormRequest = function(requestType, requestBody, requestPath, token) {
    var urlBase = 'http://vps500832.ovh.net/api/v1/';

    var returnObject = {
      statusCode: null,
      response: null
    };

    $.ajax({
      async: false,
      cache: false,
      processData: false, //ca sa nu iti proceseze data ! o lasa in formatul FormData
      contentType: false,
      enctype : 'multipart/form-data',
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
      renewToken();
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

/* renew the user token */
var renewToken = function() {
  var userData = loadUserData();
  var returnObject = apiRequest("POST", userData, 'token', null);

  if(returnObject.statusCode != 200) {
    console.log(returnObject);
    return;
  }

  userData.token = returnObject.response.token;
  saveUserData(userData);
}

var getUrlParameter = function (param) {
  var pageURL = decodeURIComponent(window.location.search.substring(1));
  var urlVariables = pageURL.split('&');

  for (var i = 0; i < urlVariables.length; i++) {
    var parameterName = urlVariables[i].split('=');

    if (parameterName[0] === param) {
      return parameterName[1];
    }
  }
};

var getUrlId = function () {
  var result = getUrlParameter("id");

  if (result === undefined) {
    alert("Non-existent ID in the URL.");
    window.location.replace("index.html");
  }

  return result;
};

var getUrlQuery = function () {
  var result = getUrlParameter("query");

  if (result === undefined) {
    alert("Non-existent query in the URL.");
    window.location.replace("index.html");
  }

  return result;
};
