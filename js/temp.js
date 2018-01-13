$(document).ready(() => {
//MADE BY BOGDAN ENACHE
   $('select').material_select();//ALTFEL NU ITI AFISEAZA SELECT-UL/SORT

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

  class cards {

    constructor(card_id, meal_type, cooking_style, required_time, card_image, card_title,
    card_likes_text, card_text, card_content_ingredients_list, card_content_description) {
      this.card_id = card_id;
      this.meal_type = meal_type;
      this.cooking_style = cooking_style;
      this.required_time = required_time;
      this.card_image = card_image;
      this.card_title = card_title;
      this.card_likes_text = card_likes_text;
      this.card_text = card_text;
      this.card_content_ingredients_list = card_content_ingredients_list;
      this.card_content_description = card_content_description;
      var text_cards="";
      var text_card_content="";
      var ingredients_list="";
      this.generate_html_text_card();
      this.generate_html_text_card_content();
    }

    generate_html_text_card() {
      this.text_card =
      `<div class = "card_box hoverable">
        <div class="card_image_container">
          <img class="card_image" src=` + this.card_image + `>
          <span class="card_title">` + this.card_title + `</span>
          <label class="card_likes_text"><i class="material-icons card_likes_icon">favorite</i>` + this.card_likes_text + `/5</label>
        </div>
        <div class="justify-text card_text">`
        + this.card_text +
        `</div>
        <div class="card_box_button">
          <a>Read more</a>
        </div>
        <div class="id" id="` + this.card_id  + `"></div>
      </div>
    </div>`
    }

    generate_html_text_card_content() {
      this.text_card_content =
      `<div class="card_content_box">
        <i class="material-icons" id="close_card_content_icon">close</i>
        <div class="row card_content">

          <div class="col s6 card_content_main_title">`
             + this.card_title +
          `</div>

          <div class="row card_content_border"></div>

          <div class="col s12 card_content_titles">
            Meal type:
            <label class="card_content_details">` + this.meal_type + `</label>
          </div>

          <div class="col s12 card_content_titles">
            Cooking Style:
            <label class="card_content_details">` + this.cooking_style + `</label>
          </div>
          <div class="col s12 card_content_required_time_title card_content_titles">
            Required Time:
            <label class="card_content_required_time card_content_details">` + this.required_time + ` mins </label>
          </div>

          <div class="row card_content_border"></div>

          <div class="col s12 card_content_ingredients_title card_content_titles">
            Ingredients
          </div>
          <ul class="col s11 offset-s1 card_content_ingredients_list card_content_details">`
            + this.ingredientsList() +
          `</ul>

          <div class="row card_content_border"></div>

          <div class="col s12 card_content_description_title card_content_titles">
            Description
          </div>
          <div class="col s12 card_content_description justify-text">`
            + this.card_content_description +
          `</div>
        </div>
        <div class="card_content_like_button">
          Like
        </div>
      </div>`
    }

    increaseLikes() {
      this.card_likes_text ++;
    }

    ingredientsList() {
      let temp="";
      this.card_content_ingredients_list.forEach(function(item) {
        temp = temp +
        `<li style="list-style-type: disc">` + item + `</li>`
      })
      this.ingredients_list = temp;
      return temp;
    }

    get html_text_card() {
      return this.text_card;
    }

    get html_text_card_content() {
      return this.text_card_content;
    }

    get mealType() {
      return this.meal_type;
    }

    get cookingStyle() {
      return this.cooking_style;
    }

    get requiredTime() {
      return this.required_time;
    }

    get cardID() {
      return this.card_id;
    }

  }

/* testing to see if jquerry works
  $.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20%2a%20from%20yahoo.finance.quotes%20WHERE%20symbol%3D%27WRC%27&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback', function(data) {
    console.log(data.query.created);
  });
  console.log('aaa');

  /*link = 'http://127.0.0.1:8998/recipes/1/aaaaa/' //django json request with filter (local)
  $.getJSON(link, function(data) {
    console.log(data[0].title);
  });

  link = 'http://127.0.0.1:8998/recipes/' //django json request list (local)
  $.getJSON(link, function(data) {
    console.log(data[1].title);
  });*/

/*asking for details for certain recipe
  //link = 'http://2id60.win.tue.nl:8998/recipes/44/' //django json request with filter (server)
  link = 'http://127.0.0.1:8998/recipes/10';
  $.getJSON(link, function(data) {
    console.log(data[0].detail);
    console.log(data[0].title + " FILTER");
    console.log(data[0].image + " IMAGE"); //returneaza link-ul !
  });

  link = 'http://2id60.win.tue.nl:8998/recipes/' //django json request list (server)
  $.getJSON(link, function(data) {
    console.log(data[1].title + "NO FILTER");
  });

  console.log('aaa');


//post


//post recipe
link = 'http://127.0.0.1:8998/post/4rz-9d95c948f586d1b3ac5f/22/'
//link = 'http://2id60.win.tue.nl:8998/post/4rx-16a243cd347eb616ce0c/18/'; //link-ul e optional
  $.ajax({
    url: link,
    type: 'POST',
    data: {
      title: 'lldragos MM nu nu nu mai suge pulaaaa!!',
      text: "ceva text",
      detail: "niste detalii",
      token: "4rz-9d95c948f586d1b3ac5f", //asta
      user: "22", //si cu asta sunt obligatorii !!
    //credentials: 'include'
    },
    success(response) {
      //console.log(response);
      console.log("succes!");
    },
    error(jqXHR, status, errorThrown) {
      console.log(jqXHR);
    }
  });
  /*endpost*/

/*register
  //link = 'http://127.0.0.1:8998/register/'; //link-ul e optional
  link = 'http://2id60.win.tue.nl:8998/register/';
    $.ajax({
      url: link,
      type: 'POST',
      data: {
        username: 'dragosefrate12',
        password: "cevatext12",
      },
      success(response) {
        console.log(response);
        console.log("succes!");
      },
      error(jqXHR, status, errorThrown) {
        console.log(jqXHR);
      }
    });*/

  //meal_type, cooking_style, required_time, card_image, card_title,
  //card_likes_text, card_text, card_content_ingredients_list, card_content_description
  var number_cards_displayed = 0; //number of cards displayed (interval incepe cu 1)
  const default_search_text = "Search recipe";
  var view_recipes="s12"; //s12 means list view
  var device="";
  const MAX_COOKING_TIME = 120;
  //ordinea conteaza !! trebuie sa fie la fel!
  const id_list_filter_meal_type = ['Breakfast_Brunch', 'Lunch', 'Dinner', 'Appetizers', 'Desserts'];
  const class_list_filter_meal_type = ['Breakfast', 'Lunch', 'Dinner', 'Appetizers', 'Desserts'];
  //the order must be the same !!
  const id_list_filter_cooking_style = ['BBQ', 'Slow_Cooker', 'Vegan', 'Oven'];
  const class_list_filter_cooking_style = ['BBQ', 'Slow_Cooker', 'Vegan', 'Oven'];
  //the order must be the same !!
  const id_list_filter_required_time = ['less_15', 'between_15_30', 'between_30_60', 'more_60'];
  const CARDS_ON_LOAD = 4; //how many cards to load at a time
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
  checkDevice();
  retrieve_cards();

  // --------------------- AJAX REQUESTS/POSTS ---------------------

//retrieve data from server for all cards
  function retrieve_cards() {
    link = 'http://127.0.0.1:8998/recipes/';

    $.getJSON(link, function(data) {
      if (data && data != "") {
        console.log("retrieved recipes succesfully!");
        console.log(data);
        construct_card_classes(data);
      }
      else {//error connecting with the server

      }
    });
  }


  //------------------- FUNCTIONS FOR AJAX --------------------------

  function construct_card_classes(data) {
    for (i = 0; i < data.length; i++) {
      id = data[i].id;
      card_title = data[i].title;
      card_text = data[i].summary;
      meal_type = data[i].meal_type;
      cooking_style = data[i].cooking_style;
      required_time = data[i].required_time;
      card_content_description = data[i].description;
      card_image = data[i].image;
      carduri.push(new cards(id, meal_type, cooking_style, required_time, card_image, card_title, "2", card_text, ["am uitat"], card_content_description));
      console.log(carduri[0] + "aaa");
    }
  }

  carduri.push(new cards("9","Desserts","Oven", "55", "images/cheesecake.jpg", "Cheesecake",
  "5",  `This cake is easy to make, and it's so delicious. Everyone that's tried it has said it tasted just like the ones from granny! You'll love it`,
  ["1-1/2 cups graham cracker crumbs","3 Tbsp. sugar","1/3 cup butter or margarine, melted","4 pkg. (8 oz. each) PHILADELPHIA Cream Cheese, softened",
  "1 cup sugar", "1 tsp. vanilla", "4 eggs"],
  `Heat oven to 175 celsius.
  Combine graham crumbs, 3 Tbsp. sugar and butter; press onto bottom of 9-inch springform pan.
  Beat cream cheese, 1 cup sugar and vanilla with mixer until blended. Add eggs, 1 at a time, mixing on low speed after each just until blended. Pour over crust.
  Bake 55 min. or until center is almost set. Run knife around rim of pan to loosen cake; cool before removing rim. Refrigerate cheesecake 4 hours.`));

  carduri.push(new cards("1", "Lunch", "BBQ", "13", "images/burger_with_fries.jpeg", "Burger",
  "4.8", "Sink your teeth into a delicious restaurant-style, hamburger recipe made from lean beef. Skip the prepackaged patties and take the extra time to craft up your own, and that little extra effort will be worth it.",
  ["1 pound ground lean (7% fat) beef", "1 large egg", "1/2 cup minced onion", "1/4 cup fine dried bread crumbs", "1 tablespoon Worcestershire",
    "1 or 2 cloves garlic, peeled and minced", "About 1/2 teaspoon salt", "4 hamburger buns (4 in. wide), split", "4 thin slices red onion"],
  `In a bowl, mix ground beef, egg, onion, bread crumbs, Worcestershire, garlic, 1/2 teaspoon salt, and 1/4 teaspoon pepper until well blended.
  Divide mixture into four equal portions and shape each into a patty about 4 inches wide.Lay burgers on an oiled barbecue grill over a solid bed of hot coals or high heat on a gas grill (you can hold your hand at grill level only 2 to 3 seconds); close lid on gas grill.
  Cook burgers, turning once, until browned on both sides and no longer pink inside (cut to test), 7 to 8 minutes total. Remove from grill.
  Lay buns, cut side down, on grill and cook until lightly toasted, 30 seconds to 1 minute.
  Spread mayonnaise and ketchup on bun bottoms. Add lettuce, tomato, burger, onion, and salt and pepper to taste. Set bun tops in place.`));

  carduri.push(new cards("7","Dinner","Slow_Cooker", "34", "images/salmon.jpeg", "Salmon",
  "4.3",  `I had a craving for fresh fish and dill, so I played around and came up with this. Its been rated one of my greatest hits! Great with rice or potatoes and steamed green beans.`,
  ["1/4 cup butter, melted", "1/4 cup white wine", "1 lemon, juiced", "5 cloves garlic, chopped", "1 bunch fresh dill, stems trimmed",
  "1 (1 pound) salmon fillet", "1/2 cup toasted almonds"],
  `Preheat oven to 375 degrees F (190 degrees C). Mix butter, white wine, lemon juice, and garlic together in a small bowl.
  Pour a small amount of the butter mixture into an 8x8-inch baking pan until bottom is evenly coated; cover with a thin layer of dill. Place salmon, skin side down, into the baking pan. Sprinkle with remaining dill; pour remaining butter mixture over salmon. Cover tightly with aluminum foil.
  Bake in preheated oven until fish flakes easily with a fork, 25 to 35 minutes. Sprinkle generously with almonds before serving.`));

  carduri.push(new cards("5","Dinner","BBQ", "68", "images/steak.jpg", "Steak",
  "4.3",  `Sirloin steak with chunky chips makes a great Friday night supper - this version is also iron, vitamin c and fibre rich`,
  ["350g sweet potatoes, peeled and cut into thick chips", "1 tbsp cold-pressed rapeseed oil", "2 x 200g sirloin steaks",
  "50g bag mixed spinach, watercress & rocket salad", "2 ripe tomatoes, cut into wedges", "2 spring onions, trimmed and finely sliced",
  "2 tsp balsamic vinegar", "2 tbsp cold-pressed rapeseed oil"],
  `Heat oven to 220C/200C fan/gas 7. Half-fill a medium saucepan with water and bring to the boil. Add the sweet potatoes and cook for 4 mins, then drain through a colander and return to the saucepan. Pour over 2 tsp of the oil and season with a little black pepper. Toss until the potatoes are lightly coated with the oil.
  Tip the potatoes onto a baking tray and cook in the oven for 15 mins, then turn with a spatula and cook for a further 10 mins or until crisp and golden.
  While the potatoes are baking, prepare the steak. Trim off any hard fat from the beef, then rub all over with the remaining oil. Season with 1 tsp coarsely ground black pepper. Put a large non-stick frying pan or griddle over a medium-high heat and, when hot, add the steaks and cook for about 2 mins each side or until done to your liking.
  Mix the salad leaves, tomatoes, cucumber, spring onions and beans in a bowl. Whisk the vinegar, oil and garlic together. Divide the steak, chips and salad between two plates and pour over the dressing just before serving.`));
/*
  carduri.push(new cards("2","Dinner","BBQ", "57", "images/steak.jpg", "Steak2",
  "4.3",  "(1)I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively."
  + "(1)I am a very simple card. I am good at containing small bits of information." +
  "I am convenient because I require little markup to use effectively!STEAK!", ["salt","steak","vegetables"],
  "a long text about steaks2"));*/
/*
  carduri.push(new cards("3","Lunch","Oven", "23", "images/pizza.jpg", "Pizza",
  "3.2",  `A simple mushroom spinach pizza, much better then takeout pizza!
  Pizza is a traditional Italian dish consisting of a yeasted flatbread typically topped with tomato sauce and cheese and baked in an oven. It is commonly topped with a selection of meats, vegetables and condiments.
  The term pizza was first recorded in the 10th century, in a Latin manuscript from Gaeta in Southern Lazio on the border with Campania.[1] Modern pizza was invented in Naples, Campania, Southern Italy, and the dish and its variants have since become popular and common in many areas of the world.[2]
  Naples, aims to "promote and protect... the true Neapolitan `,
  ["1 (12 inch) pre-baked pizza crust","3 tablespoons olive oil","1 teaspoon sesame oil","1 cup fresh spinach, rinsed and dried",
  "8 ounces shredded mozzarella cheese", "1 cup sliced fresh mushrooms"],
  `Preheat oven to 350 degrees F (175 degrees C). Place pizza crust on baking sheet.
  In a small bowl, mix together olive oil and sesame oil. Brush onto pre-baked pizza crust, covering entire surface. Stack the spinach leaves, then cut lengthwise into 1/2 inch strips; scatter evenly over crust. Cover pizza with shredded mozzarella, and top with sliced mushrooms.
  Bake in preheated oven for 8 to 10 minutes, or until cheese is melted and edges are crisp.
  Whisk 3 3/4 cups flour and 1 1/2 teaspoons salt. Make a well and add 1 1/3 cups warm water, 1 tablespoon sugar and 1 packet yeast. When foamy, mix in 3 tablespoons olive oil; knead until smooth, 5 minutes.
  Brush with olive oil, cover in a bowl and let rise until doubled, about 1 hour 30 minutes. Divide into two 1-pound balls. Use 1 pound per recipe unless noted.`));

  carduri.push(new cards("11","Lunch","Vegan", "30", "images/soup.jpg", "Soup",
  "4.7",  `Hearty lentil soup, chock full of veggies and very delicious. Serve with warm cornbread.`,
  ["1 onion, 1/4 cup olive oil", "2 carrots, diced", "2 stalks celery, chopped", "2 cloves garlic, minced", "1 teaspoon dried oregano",
  "1 bay leaf", "1 teaspoon dried basil", "1 (14.5 ounce) can crushed tomatoes", "2 cups dry lentils", "8 cups water", "1/2 cup spinach, rinsed and thinly sliced"],
  `In a large soup pot, heat oil over medium heat. Add onions, carrots, and celery; cook and stir until onion is tender. Stir in garlic, bay leaf, oregano, and basil; cook for 2 minutes.
  Stir in lentils, and add water and tomatoes. Bring to a boil. Reduce heat, and simmer for at least 1 hour. When ready to serve stir in spinach, and cook until it wilts.
  Stir in vinegar, and season to taste with salt and pepper, and more vinegar if desired.
  Margherita Stretch dough into two thin 9-inch rounds. Top each with 1/2 cup crushed San Marzano tomatoes, dried oregano, salt, pepper and olive oil; bake until golden.
  Sprinkle with1/2 pound diced mozzarella, torn basil and salt. Bake until the cheese melts, then drizzle with olive oil. RANDOM TEXT TO SEE SCROLL WORKS.
  Must you with him from him her were more. In eldest be it result should remark vanity square. Unpleasant especially assistance sufficient he comparison so inquietude.
  Branch one shy edward stairs turned has law wonder horses. Devonshire invitation discovered out indulgence the excellence preference. Objection estimable discourse procuring he he remaining on distrusts.
  Simplicity affronting inquietude for now sympathize age. She meant new their sex could defer child. An lose at quit to life do dull.
  Offered say visited elderly and. Waited period are played family man formed. He ye body or made on pain part meet. You one delay nor begin our folly abode. By disposed replying mr me unpacked no.
  As moonlight of my resolving unwilling.
  Not him old music think his found enjoy merry. Listening acuteness dependent at or an. Apartments thoroughly unsatiable terminated how themselves. She are ten hours wrong walls stand early.
  Domestic perceive on an ladyship extended received do. Why jennings our whatever his learning gay perceive.
  Is against no he without subject. Bed connection unreserved preference partiality not unaffected. Years merit trees so think in hoped we as.`));
*/

  //console.log(carduri[0].html_text_card);
  //console.log(carduri[0].html_text_card_content);
  //console.log(carduri[0].mealType + " " + carduri[0].cookingStyle + " " +
  //carduri[0].requiredTime + carduri[0].cardID);
  appendCardsHtml(0); //add the first one
  appendCardsHtml(1);//add the second one
  last_index_of_card_used = 1;
  number_cards_displayed = 2;
  console.log(carduri.length);

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

//show filter box on mobile
  let rotated = false; //rotate the icon
  $(".filter_mobile_collapse_button").on("click", event => {
    if (!rotated) {
      $(".colapse_filter_button_icon").css({
        "transform":"rotate(180deg)"
      })
      rotated = true;
    } else {
      $(".colapse_filter_button_icon").css({
        "transform":"rotate(0deg)"
      })
      rotated = false;
    }
    $(".filter_box_mobile").slideToggle("slow");
  });

  $(".confirm_filter_button, .confirm_filter_button_mobile").on("mouseenter", event => {
    /*$(event.currentTarget).css({
      "background-color": "#99ffcc"
    });*/
    /*$(".confirm_filter_button").animate({
      background-color: '#99ffcc'
    },"slow"); DOES NOT WORK WITH COLORS */
    $(event.currentTarget).css({
      "box-shadow": "0 1px 6px 0 rgba(0, 0, 0, 0.5)"
    });
  })

  $(".confirm_filter_button, .confirm_filter_button_mobile").on("mouseleave", event => {
    $(event.currentTarget).css({
      "box-shadow": "0 0px 0px 0 rgba(0, 0, 0, 0)"
    });
  });

// apply new filters DESKTOP (if the apply button is pressed from desktop,
// then only the filters from desktop are going to be taken into consideration)
  $(".confirm_filter_button").on("click", event => {
    $(event.currentTarget).css({
      "box-shadow": "0 0px 0px 0 rgba(0, 0, 0, 0)"
    });
    classes_filter_list_applied = []; //reset the list with desired filters
    //if anything from filter box is checked
    if (checkFilterBox() == true || checkFilterBox() == false) {
      card_filter_applied = true; // in this way we know the desired filter has been applied
      reloadCards();
    }
  });

// apply new filters MOBILE (if the apply button is pressed from mobile,
// then only the filters from mobile are going to be taken into consideration)
  $(".confirm_filter_button_mobile").on("click", event => {
    $(event.currentTarget).css({
      "box-shadow": "0 0px 0px 0 rgba(0, 0, 0, 0)"
    });
    classes_filter_list_applied = []; //reset the list with desired filters
    //if anything from filter box is checked
    if (checkFilterBox() == true) {
      card_filter_applied = true; // in this way we know the desired filter has been applied
      reloadCards();
    }
  });

//check if anything from the filter box has been checked (true <=> checked)
//acts as a sync between filter list mobile and filter list desktop
  function checkFilterBox() {
    // assumed that nothing is checked
    anything_checked = false;
    filter_applied_on_meal_type = false;
    filter_applied_on_cooking_style = false;
    filter_applied_on_required_time = false;
    checkDevice();
    let m = "";
    if (device === "mobile") {
      m = "M"; //take into consideration only the filter list from mobile
    }
    //meal type filter
    for (i = 0; i < id_list_filter_meal_type.length; i++) {
      if ($('#' + id_list_filter_meal_type[i] + m).is(":checked")) {
        classes_filter_list_applied.push(class_list_filter_meal_type[i]);
        anything_checked = true;
        filter_applied_on_meal_type = true;
        //sync the filter list
        $('#' + id_list_filter_meal_type[i]).prop('checked',true);
        $('#' + id_list_filter_meal_type[i] + 'M').prop('checked',true);
      } else {
        //sync the filter list, make them both false
        $('#' + id_list_filter_meal_type[i]).prop('checked',false);
        $('#' + id_list_filter_meal_type[i] + 'M').prop('checked',false);
      }
    }

    // cooking style filter
    for (i = 0; i < id_list_filter_cooking_style.length; i++) {
      if ($('#' + id_list_filter_cooking_style[i] + m).is(":checked")) {
        classes_filter_list_applied.push(class_list_filter_cooking_style[i]);
        anything_checked = true;
        filter_applied_on_cooking_style = true;
        //sync the filter list
        $('#' + id_list_filter_cooking_style[i]).prop('checked',true);
        $('#' + id_list_filter_cooking_style[i] + 'M').prop('checked',true);
      } else {
        //sync the filter list
        $('#' + id_list_filter_cooking_style[i]).prop('checked',false);
        $('#' + id_list_filter_cooking_style[i] + 'M').prop('checked',false);
      }
    }

    // required time filter
    for (i = 0; i < id_list_filter_required_time.length; i++) {
      if ($('#' + id_list_filter_required_time[i] + m).is(":checked")) {
        //sync the filter list
        $('#' + id_list_filter_required_time[i]).prop('checked',true);
        $('#' + id_list_filter_required_time[i] + 'M').prop('checked',true);

        if (id_list_filter_required_time[i] == 'less_15') {
          for (j = 1; j < 15; j++)
            classes_filter_list_applied.push(j.toString());

        } else if (id_list_filter_required_time[i] == 'between_15_30') {
            for (j = 15; j <= 30; j++)
              classes_filter_list_applied.push(j.toString());

        } else if (id_list_filter_required_time[i] == 'between_30_60') {
            for (j = 30; j <= 60; j++)
              classes_filter_list_applied.push(j.toString());

        } else if (id_list_filter_required_time[i] == 'more_60') {
            for (j = 60; j <= MAX_COOKING_TIME; j++)
              classes_filter_list_applied.push(j.toString());
        }
        anything_checked = true;
        filter_applied_on_required_time = true;
      } else {
        //sync the filter list, make both false
        $('#' + id_list_filter_required_time[i]).prop('checked',false);
        $('#' + id_list_filter_required_time[i] + 'M').prop('checked',false);
      }
    }
    console.log("This are the filters: " + classes_filter_list_applied + " " + anything_checked);
    console.log("This are the boolean for filters: " +  filter_applied_on_meal_type +
     " " + filter_applied_on_cooking_style + " " + filter_applied_on_required_time);
    return anything_checked;
  }
/*
  function hideMealAll() {
    let i = 0;
    for (i = 0; i < class_list_filter_meal_type.length; i++)
      $('.' + class_list_filter_meal_type[i]).hide();
  }

  function showMealAll() {
    let i = 0;
    for (i = 0; i < class_list_filter_meal_type.length; i++)
      $('.' + class_list_filter_meal_type[i]).show();
  }

  function hideCookingAll() {
    let i = 0;
    for (i = 0; i < class_list_filter_cooking_style.length; i++)
      $('.' + class_list_filter_cooking_style[i]).hide();
  }

  function showCookingAll() {
    let i = 0;
    for (i = 0; i < class_list_filter_cooking_style.length; i++)
      $('.' + class_list_filter_cooking_style[i]).show();
  }

  function hideTimeAll() {
    for (i = 0; i <= max_cooking_time; i++)
      $('.' + i.toString()).hide();
  }

  function showTimeAll() {
    for (i = 0; i <= max_cooking_time; i++)
      $('.' + i.toString()).show();
  }

  function showTime(time) {
    if (id_list_filter_required_time[time] === 'less_15') {
      for (i = 0; i < 15; i++)
        $('.' + i.toString()).show();
    } else if (id_list_filter_required_time[time] === 'between_15_30') {
        for (i = 15; i <= 30; i++)
          $('.' + i.toString()).show();
    } else if (id_list_filter_required_time[time] === 'between_30_60') {
      for (i = 30; i <= 60; i++)
        $('.' + i.toString()).show();
    } else {
      for (i = 60; i <= max_cooking_time; i++)
        $('.' + i.toString()).show();
    }
  }*/

//left to be implemented when database is available
//function showCards(type) {
  //querry and appendCardsHtml based on type
  //in this way we always have something to display
  //otherwise we might have cards with the desired filters but they are not yet displayed !
  //tot ceea ce am facut mai sus cu hide classes poate fi vazut ca ceva de siguranta mai mult
  //in niciun caz de incarcare !
//}
/* OLD VERSION, DOES NOT WORK ON DYNAMIC ELEMENTS
  $(".filter_box label, .card_box_button a").on("mouseenter", event => {
    //alert("A1");
    $(event.currentTarget).css({
        "color": "#ffcc00"
    });
  })


  $(".filter_box label, .card_box_button a").on("mouseleave", event => {
    $(event.currentTarget).css({
      "color": "#9e9e9e"
    });
  })
*/
/* change color when hover */
  $("body").on("mouseenter", ".card_box_button a, .filter_box label, .account_options a", function() {
    //alert("A1");
    $(this).css({
        "color": "#ffcc00"
    });
  })

/* change color when hover */
  $("body").on("mouseleave", ".card_box_button a, .filter_box label, .account_options a", function() {
    $(this).css({
      "color": "#9e9e9e"
    });
  })

//switch to list view
  $(".view_list_button").on("click", event => {
    if ($(".view_list_button").hasClass('pressed'));
      else {
        $(".view_list_button").toggleClass('pressed');
        $(".view_module_button").toggleClass('pressed');
        view_recipes = "s12";
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
        view_recipes = "s6";
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

    /*
    temp_count = card_count;
    console.log(view_recipes === 's6');
    console.log(temp_count + " " + carduri.length);
    //make them evenly when view module
    if (view_recipes == "s6" && temp_count % 2 == 0 && temp_count + 1 < carduri.length) {
      appendCardsHtml(temp_count+1);
      card_count ++;
    }*/
  }

// check if the card at index position respects the requirements
  function meetsFilter(index) {
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
    $('.actual_list_recipes').html("");
    console.log("Clear cards...");
  }

  //appending cards in html
  //note: resize must be called separately
  function appendCardsHtml(index) {
    if (index == carduri.length) {
      console.log("End in append " + index);
      return; //avoid errors
    }
    $(".actual_list_recipes").append(//AICI ERA PROBLEMA, TREBUIE APPEND IN LOC DE BEFORE
      //ALTFEL APAR PROBLEME DE SINCRONIZARE
      `<div class="col ` + view_recipes + " card_ " +
      carduri[index].mealType + " " + carduri[index].cookingStyle + " " +
      carduri[index].requiredTime + `">` + carduri[index].html_text_card);
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
    if ($(".type_display").css('float')=="right")
      device = "desktop";
      else {
        device = "mobile";
      }
  }

  //set card height based on whether the view is a list or a module
  //and if the website is viewed on mobile/tablet or desktop
  $(window).resize(function() {
    if ($(".view_module_button").hasClass('pressed') &&
        $(".type_display").css('float')=="right") {
          //desktop
      console.log("resize: adjust to module view on desktop");
      $(".card_box").css ({
        "height":"600px"
      });
      //alert("d");
    } else {
      //tablets and phones
        if (view_recipes != "s12") {
          view_recipes = "s12";
          $(".view_module_button").removeClass('pressed');
          $(".view_list_button").addClass('pressed');
          console.log("resize: adjust to list view on desktop tablets and phones");
          reloadCards();
          $(".card_box").css ({
            "height":"auto"
          });
        }
    }
    checkDevice();
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
        if (temp_count == CARDS_ON_LOAD) {
          console.log(last_index_of_card_used + 'a');
          break;
        }
        i++;
      }

      if (last_index_of_card_used + 1 == carduri.length || i == carduri.length) {
        $(".load_more_recipes_button").hide();
      }
      window.dispatchEvent(new Event('resize')); //to adjust the height of the new cards !
      //apparently the new cards have the old css style, so if the view is module, it will create problems!!!

      //console.log(view_recipes);
      // hide the load button if max has been reached !

    //to adjust card height
    //including the height of the new one !
    //it will call the method .resize
    //posibil problema de sincronizare intre appendCardsHtml si resize ! treb verificat
  })

//show card_content when card button is clicked
  $("body").on("click", ".card_box_button a", function() {
    let item = 0;
    $(".card_content_background").empty();
    //finding the id of the clicked card
    item = $(this).parent().parent().find('.id').attr("id");
    console.log(item);
    //append the content of this card into the card content
    $(".card_content_background").append(carduri[id_return_index(item)].html_text_card_content);
    $(".card_content_background").removeClass("hide");
  })

//show card_content when card is clicked
  $("body").on("click", ".card_box", function() {
    let item = 0;
    $(".card_content_background").empty();
    //finding the id of the clicked card
    item = $(this).find('.id').attr("id");
    console.log(item);
    //append the content of this card into the card content
    $(".card_content_background").append(carduri[id_return_index(item)].html_text_card_content);
    $(".card_content_background").removeClass("hide");
  })

//close card_content when close button is pressed
  $("#close_card_content_icon").on("click", event => {
    $(".card_content_background").addClass("hide");
  })

//close card_content when gray button is pressed
  $(".card_content_background").on("click", event => {
    $(".card_content_background").addClass("hide");
  });

 //close card_content when escape button is pressed
  $(document).keyup(function(e) {
     if (e.keyCode == 27) {
       $(".card_content_background").addClass("hide");
    }
  });

  //or automatically
  /*$(window).scroll(function() {
   if($(window).scrollTop() >= $(document).height() * 6/10 && count <=10) {
       $(".load_more_recipes_button").before(carduri);
       count++;
   }
});*/




});
