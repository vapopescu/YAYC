$(document).ready(() => {

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
      //window.location.replace("http://vps500832.ovh.net/yayc/login.html");
    } else if (userData.token == null) {
      console.log("Not logged in");
      //window.location.replace("http://vps500832.ovh.net/yayc/login.html");
    }
  }

  check();
  //temp();

  function temp () {
    userData = {
			name: "jordon47",
			email: "user1@example.org",
			password: "password",
			token: "a45bb3e42231ef711102ff76255bb52e2543609eb2592fd58d9092889aaba82aa6684a26175ee8b95318c6e6495ddf0ae9c80d38d16c97022cbe803a1b224b8e",
			id: "5",
		}
    saveUserData(userData);
  }

});
