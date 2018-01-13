$(document).ready(() => {


class subscribers {

    constructor(subscriber_name, subscriber_image, subscriber_id) {
      this.subscriber_name = subscriber_name;
      this.subscriber_image = subscriber_image;
      this.subscriber_id = subscriber_id;
      this.subscriber_link = "user-page.html?id=" + this.subscriber_id;
      var text_cards="";
      this.generate_html_text_subscriber();
    }

    generate_html_text_subscriber() {
      this.text_card =
      `<li><a class="side_bar_subscriber_container" href='` + this.subscriber_link + `'>
        <img src="` + this.subscriber_image +`" class='side_bar_subscriber_icon'>
        <label class="side_bar_subscriber_title">` + this.subscriber_name + `</label></a></li>`;
    }

    get html_text_subscriber() {
      return this.text_card;
    }

  }

//stuff necessary for slide menu to work
  $('.button-collapse').sideNav({
    menuWidth: 300, // Default is 300
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true, // Choose whether you can drag to open on touch screens,
    onOpen: function(el) {
      console.log("DA");
      //$(".justify-text").hide();
      }, // A function to be called when sideNav is opened
    onClose: function(el) {
      //$(".justify-text").show();
      console.log("NU");
    }, // A function to be called when sideNav is closed
  });

  $('.collapsible').collapsible();//init colapsible


  //side bar on mobile
    $(".slide_menu_item").on('mouseenter', event => {
      if (!$(event.currentTarget).hasClass("active")) {
        $(event.currentTarget).css('background-color', '#ffcc00');
      }
    })

    $(".slide_menu_item").on('mouseleave', event => {
      if (!$(event.currentTarget).hasClass("active")) {
        $(event.currentTarget).css('background-color', 'white');
      }
    })

  //search box
    $(".search_recipe.mobile").on('keypress', () => {
      const sir = $(".search_recipe.mobile").val();
      if (default_search_text.indexOf(sir) >= 0)
        $(event.currentTarget).val('');
    })

    $(".search_recipe.desktop").on('keypress', () => {
      const sir = $(".search_recipe.desktop").val();
      if (default_search_text.indexOf(sir) >= 0)
        $(event.currentTarget).val('');
    })

  //clear search box mobile
    $("#clear_recipe_icon_mobile").on("click", () => {
      $(".search_recipe.mobile").val('');
    })

  /* delete the user data from the local storage */
  $("#logout").on("click", event => {
      deleteUserData();
      window.location.replace("http://vps500832.ovh.net/yayc/login.html");
  })

// --------------------- AJAX REQUESTS/POSTS ---------------------

  function apiRequest (requestType, requestBody, requestPath, token) {
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
    console.log("Error in ajax, user not logged in: " + requestPath);
  }	else if(returnObject.statusCode != 200) {
      console.log("Error in ajax: " + requestPath + " " + returnObject.statusCode + " " + returnObject.response);
      return;
  } else {
    console.log("Succes in ajax: " + requestPath);
  }

   return returnObject;
  };

//------------------- FUNCTIONS FOR AJAX --------------------------

function loadUserData () {
  return JSON.parse(localStorage.getItem("userData"));
  };

  function retrieve_subscribers(userData) {
    data = apiRequest("GET", null, "user/" + userData.id + "?load=subscriptions.target", userData.token);
    if (data != null) {
      console.log("Subscribers list retrieved succesfully!");
      constructSubscribers(data.response.subscriptions);
    } else {
      console.log("Error in retrieving subscribers list");
    }
  }

  /* delete the user data from the local storage */
  function deleteUserData() {
    localStorage.removeItem("userData");
    console.log("Signed out:");
    console.log("User details: " + localStorage.getItem("userData"));
  }

//------------------- FUNCTIONS FOR HTML --------------------------

  var abonati = [];

  //only thing to be executed at the begining
  setup();
  //temp(); //only for testing purposes

  function temp() {
    subscriber_name = "Mimi1"
    subscriber_image = "images/subscriber_icon_demo_cat.jpeg";

    abonati.push(new subscribers(subscriber_name, subscriber_image));
    init();
  }

//retrieve data for subscribers from server only if user is loged in
  function setup() {
    userData = loadUserData();
    if (userData != null) {
      console.log("setup() navbar.js: Name:" + userData.name + " Token:" + userData.token);
      //retrieve_cards();//to be deleted
      retrieve_subscribers(userData);
    } else {
      console.log("setup(): Error, user is not logged in! No videos to retrieve");
    }
}

//generate the subscriber objects
  function constructSubscribers(data) {
    for (i = 0; i < data.length; i++) {
      subscriber_name = data[i].target.name;
      subscriber_image = data[i].target.avatar_url;
      subscriber_id = data[i].target.id;
      abonati.push(new subscribers(subscriber_name, subscriber_image, subscriber_id));
      //console.log(carduri[0] + "aaa");
    }
    //start adding the subscribers to the slide menu
    init();
  }


//insert in the html page
  function appendSubscribersHtml(index) {
      $(".side-nav").append(abonati[index].html_text_subscriber);
  }

//initialise the slide menu with the subscribers
  function init(data) {
    for (i = 0; i < abonati.length; i++) {
      appendSubscribersHtml(i);
    }
  }


})
