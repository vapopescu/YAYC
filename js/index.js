$(document).ready(() => {

  $('select').material_select();//ALTFEL NU ITI AFISEAZA SELECT-UL/SORT
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

  class cards_video {

    constructor(card_video_id, card_title, card_author, card_author_id, card_text, card_created_date, card_views, card_likes, card_image) {
      this.card_video_id = card_video_id;
      this.card_title = card_title;
      this.card_author = card_author;
      this.card_author_id = card_author_id;
      this.card_text = card_text;
      this.card_created_date = card_created_date;
      this.card_views = card_views;
      this.card_likes = card_likes;
      this.card_image = card_image;
      this.card_author_link = "user-page.html?id=" + this.card_author_id;
      this.card_video_link = "video.html?id=" + this.card_video_id;
      var text_cards="";
      this.generate_html_text_card();
    }

    generate_html_text_card() {
      this.text_card =
        `<div class = "card_box hoverable">
          <div class="card_image_container">
            <img class="card_image" src=` + this.card_image + `>
            </div>
            <div class="card_title ellipsis">
              <div>
                <a href="`+ this.card_video_link + `">` +
                  this.card_title +
                `</a>
              </div>
            </div>
            <div class="card_box_author">
              <a href="`+ this.card_author_link + `">` + this.card_author + `</a>
            </div>
            <div class="card_box_views">
              <label>` + this.card_views + ` views</label>
            </div>
            <div class="justify-text card_text ellipsis_summary">
              <div>
                <p>`
                + this.card_text +
                `</p>
              </div>
            </div>
            <div class="id" id="` + this.card_id  + `"></div>
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

  //meal_type, cooking_style, required_time, card_image, card_title,
  //card_likes_text, card_text, card_content_ingredients_list, card_content_description
  var number_cards_displayed = 0; //number of cards displayed (interval incepe cu 1)
  const default_search_text = "Search recipe";
  var view_recipes="s12"; //s12 means list view
  var device="";
  //var local = 'http://127.0.0.1:8998/recipes/';
  var local = 'http://2id60.win.tue.nl:8998/';
  const MAX_COOKING_TIME = 120;
  //ordinea conteaza !! trebuie sa fie la fel!
  const id_list_filter_meal_type = ['Breakfast_Brunch', 'Lunch', 'Dinner', 'Appetizers', 'Desserts'];
  const class_list_filter_meal_type = ['Breakfast', 'Lunch', 'Dinner', 'Appetizers', 'Desserts'];
  //the order must be the same !!
  const id_list_filter_cooking_style = ['BBQ', 'Slow_Cooker', 'Vegan', 'Oven'];
  const class_list_filter_cooking_style = ['BBQ', 'Slow_Cooker', 'Vegan', 'Oven'];
  //the order must be the same !!
  const id_list_filter_required_time = ['less_15', 'between_15_30', 'between_30_60', 'more_60'];
  var CARDS_ON_LOAD = 4; //how many cards to load at a time
  var card_filter_applied = false;
  // list with desired filters (expressed in classes)
  // we use this one to know which card to add and which one to not
  // because there is a difference between the id's of the list and the classes of the cards
  var classes_filter_list_applied = [];
  var filter_applied_on_meal_type = false;
  var filter_applied_on_cooking_style = false;
  var filter_applied_on_required_time = false;
  var last_index_of_card_used = 0;

  console.log(classes_filter_list_applied);

  //creare carduri !!! card_id NU E NEAPARAT sa fie egal cu index-ul array-ului
  const carduri=[];
  //retrieve_cards();//to be deleted
  setup();

  // --------------------- AJAX REQUESTS/POSTS ---------------------

  //retrieve data from server for all cards
  function retrieve_cards() {
    link = local + 'recipes/';


    $.getJSON(link, function(data) {
      if (data && data != "") {
        console.log("retrieved recipes succesfully! Length: " + data.length);
        console.log(data);
        //construct_card_classes(data); to be deleted !
        construct_card_videos(data);
      }
      else {//error connecting with the server

      }
    });
  }

  //------------------- FUNCTIONS FOR AJAX --------------------------


  //make request for video data
  function retrieve_videos(userData) {
    data = apiRequest("GET", null, 'video/' + "?load=user", userData.token); //retrieve data for videos
    if (data != null) {
      console.log("Videos retrieved succesfully!! generate cards");
      construct_card_videos(data.response); //create the card_video objects
    } else {
      console.log("Error in retrieving video data");
    }
  }

  //create the card_video objects
  function construct_card_videos(data) {
    console.log(data);
    console.log("data length: " + data.length);
    for (i = 0; i < data.length; i++) {

      card_video_id = data[i].id;
      card_title = data[i].name;
      card_author = data[i].user.name;
      card_author_id = data[i].user_id;
      card_text = data[i].description;
      card_created_date = data[i].created_at;
      card_views = data[i].view_count;
      card_likes = data[i].likes;
      card_image = data[i].thumbnail_url;
      carduri.push(new cards_video(card_video_id, card_title, card_author, card_author_id, card_text, card_created_date, card_views, card_likes, card_image));
      //console.log(carduri[0] + "aaa");
    }
    init();
  }
  //------------------- FUNCTIONS FOR HTML --------------------------

  //retrieve data for videos from server only if user is loged in
  function setup() {
    userData = loadUserData();
    //console.log(userData);
    retrieve_videos(userData);
  }

  //initialise the page, load some cards
  function init() {

    var userData = loadUserData();

    checkDevice();

    if (device == "desktop_large") {
      view_recipes = 's3'; //start in grid mode
      $(".card_box").css ({
        "height":"400px"
      });
    } else if (device == "desktop") {
      view_recipes = 's4'; //start in grid mode
      $(".card_box").css ({
        "height":"400px"
      });
    } else {
      view_recipes = 's12'; //start in grid mode
      $(".card_box").css ({
        "height":"auto"
      });
    }

    console.log("view_recipes: " + view_recipes);
    shuffle_cards();
    for (i = 0; i < CARDS_ON_LOAD && i < carduri.length; i++) {
      console.log(i);
      appendCardsHtml(i);
      if (device == 'mobile') {
        $(".card_box").css ({
          "height":"auto"
        });
      }
      else  {
        $(".card_box").css ({
          "height":"400px"
        });
      }
    }

    last_index_of_card_used = i-1;
    number_cards_displayed = i;

    console.log("cards_on_load:" + CARDS_ON_LOAD);
    //  }

  }

  //copied from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle_cards() {

    console.log("Shuffle cards");
    var currentIndex = carduri.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = carduri[currentIndex];
      carduri[currentIndex] = carduri[randomIndex];
      carduri[randomIndex] = temporaryValue;
    }
  }

  //sorting cards
  function sort_cards(text) {
    console.log("Sorting cards on: " + text);
    if (text == "most_liked") {
      carduri.sort(function(a, b){return b.card_likes - a.card_likes});
    } else if (text == "least_liked") {
      carduri.sort(function(a, b){return a.card_likes - b.card_likes});
    } else if (text == "most_viewed") {
      carduri.sort(function(a, b){return b.card_views - a.card_views});
    } else if (text == "least_viewed") {
      carduri.sort(function(a, b){return a.card_views - b.card_views});
    } else if (text == "newest") {
      carduri.sort(function(a, b){
        return Date.parse(b.card_created_date) - Date.parse(a.card_created_date);
      });
    } else if (text == "oldest") {
      carduri.sort(function(a, b){
        return Date.parse(a.card_created_date) - Date.parse(b.card_created_date);
      });
    } else {
      console.log("wrong request of sorting");
    }
    for (i = 0; i < carduri.length; i++) {
      console.log(carduri[i].card_created_date);
    }
  }

  //animations for mouseenter
  $("body").on("mouseenter", ".card_box_author a, .filter_box label", function() {
    //alert("A1");
    $(this).css({
      "color": "#ffcc00"
    });
  })

  //animations for mouseleave
  $("body").on("mouseleave", ".card_box_author a, .filter_box label", function() {
    $(this).css({
      "color": "#9e9e9e"
    });
  })

  //animations for mouseenter
  $("body").on("mouseenter", ".card_title a", function() {
    //alert("A1");
    $(this).css({
      "text-decoration": "underline"
    });
  })

  //animations for mouseleave
  $("body").on("mouseleave", ".card_title a", function() {
    $(this).css({
      "text-decoration": "none"
    });
  })

  //sorting the cards
  $("#sort_dropdown").change(function() {
    var selected = $(this).val();
    if (selected == 'most_liked') {
      sort_cards("most_liked");
      reloadCards();
    } else if (selected == 'least_liked') {
      sort_cards("least_liked");
      reloadCards();
    } else if (selected == "most_viewed") {
      sort_cards("most_viewed");
      reloadCards();
    } else if (selected == "least_viewed") {
      sort_cards("least_viewed");
      reloadCards();
    } else if (selected == "newest") {
      sort_cards("newest");
      reloadCards();
    } else if (selected == "oldest") {
      sort_cards("oldest");
      reloadCards();
    } else if (selected == "choose") {
      shuffle_cards();
      reloadCards();
    }
  })

  //switch to list view
  $(".view_list_button").on("click", event => {
    if ($(".view_list_button").hasClass('pressed'));
    else {
      $(".view_list_button").toggleClass('pressed');
      $(".view_module_button").toggleClass('pressed');
      reloadCards();
      window.dispatchEvent(new Event('resize'));//to adjust card height
    }
  });

  //switch to module view
  $(".view_module_button").on("click", event => {
    if ($(".view_module_button").hasClass('pressed'));
    else {
      $(".view_module_button").toggleClass('pressed');
      $(".view_list_button").toggleClass('pressed');
      reloadCards();
      window.dispatchEvent(new Event('resize'));//to adjust card height
    }
  });

  //reload cards into the new view mode/into the new filter requirements
  function reloadCards() {
    clearCardsHtml();//clear all current cards

    console.log("Reload cards...");
    last_index_of_card_used = 0;

    if (card_filter_applied == false) {//no filter loaded, add normally
      let temp_count = 0;//to load the exact amount it was before switching view
      //even number, thus good distribution no matter the view
      for (temp_count = 0; temp_count < number_cards_displayed; temp_count++) {
        appendCardsHtml(temp_count);
      }
      last_index_of_card_used = temp_count - 1;
    } else {//filter loaded, add what it respects the filter
      //we also start from 0 with showing cards (do not care about the old view)
      let temp_count = 0;
      for (i = 0; i < carduri.length; i++) {
        console.log("checking card: " + i);
        if (meetsFilter(i)) {
          appendCardsHtml(i);
          temp_count++;
          last_index_of_card_used = i;
          if (temp_count == CARDS_ON_LOAD) {//at first load only the first CARDS_ON_LOAD cards
            console.log("Enough cards! ReloadCards");
            break;
          }
        }
      }
      $(".load_more_recipes_button").show(); //to reset the load button
    }
    console.log("Last index used in reloadCards " + last_index_of_card_used);
    window.dispatchEvent(new Event('resize'));//to adjust card height on the new cards !

  }

  // check if the card at index position respects the requirements
  function meetsFilter(index) {
    return true;//no more filters
    if (filter_applied_on_meal_type) {
      if (classes_filter_list_applied.indexOf(carduri[index].mealType) == -1) {
        console.log("meal_type filter refuse item: " + index);
        console.log("the filter on which it was refused: " + classes_filter_list_applied);
        return false;
      }
    }
    if (filter_applied_on_cooking_style) {
      if (classes_filter_list_applied.indexOf(carduri[index].cookingStyle) == -1) {
        console.log("cooking_style filter refuse item: " + index);
        return false;
      }
    }
    if (filter_applied_on_required_time) {
      if (classes_filter_list_applied.indexOf(carduri[index].requiredTime) == -1) {
        console.log("required_time filter refuse item: " + index);
        return false;
      }
    }
    return true;
  }

  function clearCardsHtml() {
    $('.actual_list_videos').html("");
    console.log("Clear cards...");
  }

  //appending cards in html
  //note: resize must be called separately
  function appendCardsHtml(index) {
    if (index == carduri.length) {
      console.log("End in append " + index);
      return; //avoid errors
    }
    $(".actual_list_videos").append(//AICI ERA PROBLEMA, TREBUIE APPEND IN LOC DE BEFORE
      //ALTFEL APAR PROBLEME DE SINCRONIZARE
      `<div class="col ` + view_recipes + " card_ " + `">` + carduri[index].html_text_card);
    console.log("Append card with index: " + index);
  }

  //return the array index based on id
  function id_return_index(id) {
    for (i = 0; i < carduri.length; i++)
      if (carduri[i].cardID == id)
        return i;
  }

  // check if device used is a desktop or a mobile
  function checkDevice() {
    if ($(".type_display").css('font-size')=="15px") {
      device = "desktop";
      CARDS_ON_LOAD = 3; //load only 3 cards at a time
    } else if ($(".type_display").css('font-size')=="16px") {
      device = "desktop_large";
      CARDS_ON_LOAD = 4; //load only 4 cards at a time
    } else {
      device = "mobile";
      CARDS_ON_LOAD = 4;
    }
  }

  //set card height based on whether the view is a list or a module
  //and if the website is viewed on mobile/tablet or desktop
  $(window).resize(function() {
    console.log("resize.." + view_recipes);
    checkDevice();
    if ($(".view_module_button").hasClass('pressed') && device != 'mobile') {
      //desktop
      console.log("resize: adjust to module view on: " + device);
      $(".card_box").css ({
        "height":"400px"
      });
      if (device == 'desktop_large' && view_recipes != 's3') {
        view_recipes = 's3';
        reloadCards();
        //console.log("resize: adjust to module view on desktop_large!");
      } else if (device == 'desktop' && view_recipes != 's4') {
        view_recipes = 's4';
        reloadCards();
        //console.log("resize: adjust to module view on desktop!");
      }
      //alert("d");
    } else {
      //tablets and phones
      $(".card_box").css ({
        "height":"auto"
      });
      if (view_recipes != "s12") {
        view_recipes = "s12";
        $(".view_module_button").removeClass('pressed');
        $(".view_list_button").addClass('pressed');
        console.log("resize: adjust to list view on: " + device);
        reloadCards();
      }
    }
    //alert($(".view_module_button").hasClass('pressed'));
  })

  //loading more recipes
  $(".load_more_recipes_button").on("click", event => {
    let i = last_index_of_card_used + 1; //to avoid duplicates
    let temp_count = 0; //temporary count
    while (i < carduri.length) {
      if (meetsFilter(i)) {
        appendCardsHtml(i);
        number_cards_displayed++; //progress in displaying cards
        temp_count ++;
        console.log(i + " " + carduri[i].cardID);
        last_index_of_card_used = i;
      }
      if (number_cards_displayed % CARDS_ON_LOAD == 0) {
        console.log("last_index_of_card_used " + last_index_of_card_used);
        console.log("number_cards_displayed " + number_cards_displayed);
        break;
      }
      i++;
    }

    if (last_index_of_card_used + 1 == carduri.length || i == carduri.length) {
      $(".load_more_recipes_button").hide();
    }
    window.dispatchEvent(new Event('resize')); //to adjust the height of the new cards !
    //apparently the new cards have the old css style, so if the view is module, it will create problems!!!

  })


  //close card_content when escape button is pressed
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
    }
  });
});
