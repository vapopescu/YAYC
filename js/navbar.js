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

  //------------------- FUNCTIONS FOR AJAX --------------------------

  function retrieve_subscribers(userData) {
    data = apiRequest("GET", null, "user/" + userData.id + "?load=subscriptions.target", userData.token);
    if (data != null) {
      console.log("Subscribers list retrieved succesfully!");
      constructSubscribers(data.response.subscriptions);
      insert_info_account(data.response);
    } else {
      console.log("Error in retrieving subscribers list");
    }
  }



  //------------------- FUNCTIONS FOR HTML --------------------------

  var subscribtions = [];

  //only thing to be executed at the begining
  setup();
  //temp(); //only for testing purposes

  function temp() {
    subscriber_name = "Mimi1"
    subscriber_image = "images/subscriber_icon_demo_cat.jpeg";

    subscribtions.push(new subscribers(subscriber_name, subscriber_image));
    init();
  }

  //retrieve data for subscribers from server only if user is loged in
  function setup() {
    var userData = loadUserData();
    if (userData != null) {
      retrieve_subscribers(userData);
    }
  }

  //generate the subscriber objects
  function constructSubscribers(data) {
    for (i = 0; i < data.length; i++) {
      subscriber_name = data[i].target.name;
      subscriber_image = data[i].target.avatar_url;
      subscriber_id = data[i].target.id;
      subscribtions.push(new subscribers(subscriber_name, subscriber_image, subscriber_id));
      //console.log(carduri[0] + "aaa");
    }
    //start adding the subscribers to the slide menu
    init();
  }

  function insert_info_account(data) {
    $(".white-text.name").text(data.name);
    $("img.circle").attr("src", data.avatar_url);
  }


  //insert in the html page
  function appendSubscribersHtml(index) {
    $(".side-nav").append(subscribtions[index].html_text_subscriber);
  }

  //initialise the slide menu with the subscribers
  function init(data) {
    for (i = 0; i < subscribtions.length; i++) {
      appendSubscribersHtml(i);
    }
  }

  function search_for_mobile() {
    search_for_m = $('.search_recipe_mobile').val();
    console.log(search_for_m);
    redirect_to(search_for_m);
  }

  function search_for_desktop() {
    search_for_d = $('.search_recipe_desktop').val();
    console.log(search_for_d);
    redirect_to(search_for_d);
  }

  function redirect_to(query) {
    window.location.replace("searched.html?query=" + query);
  }

  $("#search_video_icon_m").on("click", event => {
    console.log("clicked");
    search_for_mobile();
  })

  $("#search_video_icon_d").on("click", event => {
    console.log("clicked");
    search_for_desktop();
  })

})
