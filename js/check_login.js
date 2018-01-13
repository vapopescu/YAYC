
//checks to see if the user is already logged in, if not then redirect to login page

  /* load the user data from the local storage */
  function loadUserData () {
    console.log("User details: " + localStorage.getItem("userData"));
  	return JSON.parse(localStorage.getItem("userData"));
  };

  /* save the user data into the local storage */
  function saveUserData (userData) {
	   localStorage.setItem("userData", JSON.stringify(userData));
  };

  /* delete the user data from the local storage */
  function deleteUserData() {
    localStorage.removeItem("userData");
    console.log("Signed out:");
    console.log("User details: " + localStorage.getItem("userData"));
  }

  function check() {
    var userData = loadUserData();
    //if user is not logged in
    if (userData == null) {
      console.log("Not logged in");
      window.location.replace("http://vps500832.ovh.net/yayc/login.html");
    } else if (userData.token == null) {
      console.log("Not logged in");
      window.location.replace("http://vps500832.ovh.net/yayc/login.html");
    }
  }

  check();
  //temp();

  function temp () {
    userData = {
			name: "foberbrunner",
			email: "user1@example.org",
			password: "password",
			token: "65a7f42bb100cbf1cb1638c990c19efd33d02382ae2ae31ffb2a24178d5d1656e4f1f73c3eda6f7b143492368d38b6560bf9d32f644d0d3d6155260074f29560",
			id: "4",
		}
    saveUserData(userData);
  }
