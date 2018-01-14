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

  // --------------------- AJAX REQUESTS/POSTS ---------------------


  //------------------- FUNCTIONS FOR AJAX --------------------------

    function retrieve_user_info(userData) {
      data = apiRequest("GET", null, "user/" + userData.id + "?load=videos,subscribers", userData.token);
      if (data != null) {
        console.log("User info retrieved succesfully!");
        construct_card_videos(data.response.videos);
        insert_html_info(data.response);
      } else {
        console.log("Error in retrieving subscribers list");
      }
    }

  //------------------- FUNCTIONS FOR HTML --------------------------

    var carduri = [];
    var userPageID = "";
    //only thing to be executed at the begining
    setup();
    //temp(); //only for testing purposes

  //retrieve data for subscribers from server only if user is loged in
    function setup() {
      userData = loadUserData();
      userPageID = getUrlParameter("id");
      console.log(userPageID);
      if (userData != null) {
        console.log("setup() user-page.js: Name:" + userData.name + " Token:" + userData.token);
        //retrieve_cards();//to be deleted
        retrieve_user_info(userData);
      } else {
        console.log("setup(): Error, user is not logged in or video id is not mentioned! No videos to retrieve");
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

  //insert in html the necessary data of the user
    function insert_html_info(data) {
      $("#user_avatar_url").attr("src", data.avatar_url);
      $("#user_cover_url").attr("src", data.cover_url);
      $("#user_name").text(data.name);
      $("#nr-subscribers").text(data.subscribers.length);
      $("#user_description_text").text(data.description);
      $("#user_details_text").text(data.details);
      $("#user_details_links").text(data.links);
      $("#user_created_date").text("Joined: " + data.created_at);
      $("#user_lastUpdate_date").text("Last update: " + data.updated_at);
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

  $('#upload_video_button').on('click', function(e) {

    console.log(video);
    e.preventDefault();
})

// Code to get duration of audio /video file before upload - from: http://coursesweb.net/
//register canplaythrough event to #audio element to can get duration
var f_duration =0;  //store duration
document.getElementById('video_temp').addEventListener('canplaythrough', function(e){
  //add duration in the input field #f_du
  f_duration = Math.round(e.currentTarget.duration);
  console.log(f_duration - 1);
  URL.revokeObjectURL(obUrl);
});

//when select a file, create an ObjectURL with the file and add it in the #video_temp element
var obUrl;
document.getElementById('video_video').addEventListener('change', function(e){
  var file = e.currentTarget.files[0];
  //check file extension for audio/video type
  if(file.name.match(/\.(avi|mp3|mp4|mpeg|ogg)$/i)){
    obUrl = URL.createObjectURL(file);
    document.getElementById('video_temp').setAttribute('src', obUrl);
  }
});


});
