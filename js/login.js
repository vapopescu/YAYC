$(document).ready( () => {
  $("form#register_form").submit( (e) => {
    e.preventDefault();

    var requestType = $(document.activeElement).val();
    var userData = {
      name: $("form#register_form input[name='username']").val(),
      password: $("form#register_form input[name='password']").val(),
      token: null,
      id: null
    };
    
    console.log(userData);

    var returnObject = apiRequest("POST", userData, requestType, null);
    
    if (returnObject.statusCode == 400) {
      if (requestType == "user") {
        alert("Username already taken");
      } else if (requestType == "token") {
        alert("Username or password is not valid");
      }
      return;
    }
    
    
    
    if (requestType == "user") {
      returnObject = apiRequest("POST", userData, "token", null);
    }

    userData.token = returnObject.response.token;
    userData.id = returnObject.response.user_id;
    saveUserData(userData);
    
    window.location = "recommended.html";
  });
});
