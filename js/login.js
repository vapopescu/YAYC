$(document).ready( () => {
  $("form#register_form").submit(function(e) {
    e.preventDefault();

    var requestType = $(document.activeElement).val();
    var userData = {
      name: $("form#register_form input[name='username']").val(),
      password: $("form#register_form input[name='password']").val(),
      token: null,
      id: null
    };
    
    //console.log(userData);

    var returnObject = apiRequest("POST", userData, requestType, null);
    
    // error handling
    if (returnObject.statusCode != 200) {
      if (requestType == "user") {
        alert("Username already taken");
      } else if (requestType == "token") {
        alert("Username or password is not valid");
      }
      return;
    }
    
    // if last command was register, also login
    if (requestType == "user") {
      returnObject = apiRequest("POST", userData, "token", null);
    }

    // save user data
    userData.token = returnObject.response.token;
    userData.id = returnObject.response.user_id;
    saveUserData(userData);
    
    // redirect after login
    window.location = "recommended.html";
  });
});
