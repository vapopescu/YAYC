$(document).ready(() => {


  class cards_video {

    constructor(card_video_id, card_title, card_created_date, card_views, card_image) {
      var card_created_date_short;
      var date;
      this.card_video_id = card_video_id;
      this.card_title = card_title;
      this.card_created_date_string = card_created_date;  
      this.date = new Date(card_created_date);
      this.card_created_date_short = this.date.getFullYear() + '-' + this.date.getMonth() + 1 + '-' + this.date.getDate();
      this.card_views = card_views;
      this.card_image = card_image;
      this.card_video_link = "video.html?id=" + this.card_video_id;
      var text_cards="";
      this.generate_html_text_card();
    }

    generate_html_text_card() {


      this.text_card =
      `<div class="col-md-2">
        <div class="small-video-wrapper">
          <img class="img-fluid" src="` + this.card_image + `" alt="">
          <h6 id="video-title"><a href="` + this.card_video_link + `">` + this.card_title + `</a></h6>
          <p class="d-inline"><span id="nr-views">` + this.card_views + `</span> views </p>
          <p class="">Uploaded: <span>` + this.card_created_date_short + `</span></p>
        </div>
      </div>`
    }

    get html_text_card() {
      return this.text_card;
    }

    get cardID() {
      return this.card_id;
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

  function retrieve_user_info(userData) {
    data = apiRequest("GET", null, "user/" + userData.id + "?load=videos", userData.token);
    if (data != null) {
      console.log("User info retrieved succesfully!");
      construct_card_videos(data.response.videos);
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

  var carduri = [];

  //only thing to be executed at the begining
  setup();
  //temp(); //only for testing purposes

//retrieve data for subscribers from server only if user is loged in
  function setup() {
    userData = loadUserData();
    if (userData != null) {
      console.log("setup() user-page.js: Name:" + userData.name + " Token:" + userData.token);
      //retrieve_cards();//to be deleted
      retrieve_user_info(userData);
    } else {
      console.log("setup(): Error, user is not logged in! No videos to retrieve");
    }
}

//generate the subscriber objects
  function construct_card_videos(data) {
    console.log(data);
    for (i = 0; i < data.length; i++) {
      card_video_id = data[i].id;
      card_title = data[i].name;
      card_created_date = data[i].created_at;
      card_views = data[i].view_count;
      card_image = data[i].thumbnail_url;
      carduri.push(new cards_video(card_video_id, card_title, card_created_date, card_views, card_image));
    }
    //start adding the subscribers to the slide menu
    init();
  }


//insert in the html page
  function appendVideosHtml(index) {
      $("#videos_list").append(carduri[index].html_text_card);
  }

//initialise the slide menu with the subscribers
  function init(data) {
    for (i = 0; i < carduri.length; i++) {
      appendVideosHtml(i);
    }
  }


})
