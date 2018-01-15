var userDetails = null;
var videoData = null;
var voteData = null;
var nextCommentIdx = null;

$(document).ready(function() {

  var carduri =[];
  const CARDS_TO_LOAD = 10;
  class cards_video {

    constructor(card_video_id, card_title, card_author, card_views, card_image) {
      this.card_video_id = card_video_id;
      this.card_title = card_title;
      this.card_author = card_author;
      this.card_views = card_views;
      this.card_image = card_image;
      this.card_video_link = "video.html?id=" + this.card_video_id;
      var text_cards="";
      this.generate_html_text_card();
    }

    generate_html_text_card() {
      this.text_card =
        `<div class="d-flex flex-row playlist">
          <a href="#" class="sidevideo"><img class="img-fluid" id="related_video_image" src="` + this.card_image + `"/></a>
          <a href="` + this.card_video_link + `">
            <h5 id="related_video_title">` + this.card_title + `</h5>
            <p class="channel">by` + this.card_author + `</p>
            <p class="views">` + this.card_views + ` views</p>
          </a>
        </div>`
    }

    get html_text_card() {
      return this.text_card;
    }

    get cardID() {
      return this.card_id;
    }

  }

  // function to like/dislike
  $('#like, #dislike').on('click', function() {
    var body = {
        video_id: videoData.id,
        type: $(this).attr("name")
      }

    if (voteData == null) {
      var returnObject = apiRequest("POST", body, "vote/", userData.token);
      //console.log(returnObject);

      // error handling
      if (returnObject.statusCode != 200) {
        return;
      }

      // update vote data
      voteData = returnObject.response;
    } else {
      if (voteData.type == body.type) {
        var returnObject = apiRequest("DELETE", body, "vote/" + voteData.id, userData.token);
        //console.log(returnObject);

        // error handling
        if (returnObject.statusCode != 200) {
          return;
        }

        // update vote data
        voteData = null;
      } else {
        var returnObject = apiRequest("PUT", body, "vote/" + voteData.id, userData.token);
        console.log(returnObject);

        // error handling
        if (returnObject.statusCode != 200) {
          return;
        }

        // update vote data
        voteData = returnObject.response;

        if (body.type == "up") {
          $("#dislike").removeClass("pressed");
        } else if (body.type == "down") {
          $("#like").removeClass("pressed");
        }
      }
    }

    $(this).toggleClass("pressed");

    // update video information
    videoData = loadVideoData(videoData.id);

    // update vote count
    $("#likes").text(videoData.likes);
    $("#dislikes").text(videoData.dislikes);
  });

  // function to post a comment
  $("form#user-comment").submit(function(e) {
    e.preventDefault();

    var body = {
      video_id: videoData.id,
      content: $(this).find("textarea#comment-input").val()
    };

    // post the comment
    var returnObject = apiRequest("POST", body, "comment", userData.token);
    //console.log(returnObject);

    // error handling
    if (returnObject.statusCode != 200) {
      return;
    }

    buildComment(returnObject.response).show().prependTo("ul.comments");
    $(this).find("textarea#comment-input").val("");
  });

  // function to show more comments
  $('#comments-more').on('click', function(e) {
    e.preventDefault();

    // get 5 comments
    for (var i = 0; i < 5; i ++) {
      if (nextCommentIdx < 0) {
        return;
      }

      var commentData = videoData.comments[nextCommentIdx--];
      buildComment(commentData).show().appendTo("ul.comments");
    }
  });

  // function to construct a comment
  var buildComment = function(commentData) {
    var commentObject = $("#comment-template").clone();

    // get poster data
    var returnObject = apiRequest("GET", null, "user/" + commentData.user_id, userData.token);
    //console.log(returnObject);
    var posterData = returnObject.response;

    // error handling
    if (returnObject.statusCode != 200) {
      return;
    }

    // fill the comment
    commentObject.removeAttr("id");
    commentObject.find("a.avatar").attr("href", "user-page.html?id=" + posterData.id);
    commentObject.find("a.avatar img").attr("src", posterData.avatar_url);
    commentObject.find("a.user").attr("href", "user-page.html?id=" + posterData.id);
    commentObject.find("a.user").text(posterData.name);
    commentObject.find("span.time").text($.format.date(commentData.created_at, "MMM dd, yyyy"));
    commentObject.find("p").text(commentData.content);

    return commentObject;
  }

  // function to load video data
  var loadVideoData = function(video_id) {
    var responseObject = apiRequest("GET", null, "video/" + video_id + "?load=votes,comments", userData.token);
    //console.log(responseObject);

    // error handling
    if (responseObject.statusCode != 200) {
      alert("Invalid video id.");
      return null;
    }

    return responseObject.response;
  }

  // function to load content
  var setup = function() {
    // load user data
    userData = loadUserData();

    // send a request to get user details
    responseObject = apiRequest("GET", null, "user/" + userData.id, userData.token);
    //console.log(responseObject);
    userDetails = responseObject.response;

    // populate the page
    $("#user-comment a.avatar").attr("href", "my-page.html");
    $("#user-comment a.avatar img").attr("src", userDetails.avatar_url);

    // send a request to get video information
    videoData = loadVideoData(getUrlId());
    nextCommentIdx = videoData.comments.length - 1;
    $("#comments-more").click();

    // populate the page
    $("#title").text(videoData.name);
    $("#main-video").attr("src", videoData.video_url);
    $("#views").text(videoData.view_count);
    $("#likes").text(videoData.likes);
    $("#dislikes").text(videoData.dislikes);
    $("#description").text(videoData.description);
    $("#upload-date").text($.format.date(videoData.created_at, "MMM dd, yyyy"));

    // check if the user has voted
    for (var i = 0; i < videoData.votes.length; i++) {
      if (videoData.votes[i].user_id == userData.id) {
        voteData = videoData.votes[i];
        break;
      }
    }

    // press the corresponding button
    if (voteData != null) {
      if (voteData.type == "up") {
        $("#like").addClass("pressed");
      } else if (voteData.type == "down") {
        $("#dislike").addClass("pressed");
      }
    }

    // send a request to get channel information
    responseObject = apiRequest("GET", null, "user/" + videoData.user_id + "?load=subscribers,subscriptions.target.videos", userData.token);
    videoObject = apiRequest("GET", null, 'video/' + "?load=user", userData.token); //retrieve data for videos
    //console.log(responseObject);
    channelData = responseObject.response;
    videoData = videoObject.response;
    construct_card_videos(videoData);

    // populate the page
    $("#channel-avatar").attr("src", channelData.avatar_url);
    $("#channel-avatar").closest("a").attr("href", "user-page.html?id=" + channelData.id);
    $("#channel-name").text(channelData.name);
    $("#channel-name").attr("href", "user-page.html?id=" + channelData.id);

    // check if the user is subscribed
    for (var i = 0; i < channelData.subscribers.length; i++) {
      if (channelData.subscribers[i].source_user_id == userData.id) {
        subscriptionData = channelData.subscribers[i];
        break;
      }
    }

    // show the corresponding button
    if (subscriptionData == null) {
      $("#subscribe").show();
    } else {
      $("#unsubscribe").show();
    }
  }

  setup();

  //create the card_video objects
  function construct_card_videos(data) {
    console.log(data);
    console.log("data length: " + data.length);
    for (i = 0; i < data.length; i++) {
        card_video_id = data[i].id;
        card_title = data[i].name;
        card_author = data[i].user.name;
        card_views = data[i].view_count;
        card_image = data[i].thumbnail_url;
        carduri.push(new cards_video(card_video_id, card_title, card_author, card_views, card_image));
        //console.log(carduri[0] + "aaa");
      }
  init();
  }

  //insert the cards_video objects on the right side of the html
  function init() {
    shuffle_cards();
    for (i = 0; i < CARDS_TO_LOAD && i < carduri.length; i++) {
      console.log(i);
      appendCardsHtml(i);
    }
  }

  //insert the cards_video object on the right side of the html
  function appendCardsHtml(index) {
    if (index == carduri.length) {
      console.log("End in append " + index);
      return; //avoid errors
    }
    $("#related").append(carduri[index].html_text_card);
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

});
