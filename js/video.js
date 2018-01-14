var userData = null;
var videoData = null;
var channelData = null;
var voteData = null;
var subscriptionData = null;

$(document).ready(function() {

  // function to insert comments
  $('#comment').on('click', () => {
    var comment = $('#comment-area').val();
    $('ul.comments').prepend(`<li>
        <a href="#" class="avatar"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/38273/yt-avatar-03.png" width="50" alt="UserName" /></a>
        <a href="#" class="user">Will Morell</a>
        <span class="time">2 months ago</span>
        <p>`+comment+ `</p>
        <span><i class="fa fa-thumbs-up mr-2"></i></span>
        <span><i class="fa fa-thumbs-down mr-2"></i></span>
        <span><i class="fa fa-reply mr-2"></i></span>
      </li>`
    );
  });

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
  
  // function to subscribe
  $('#subscribe').on('click', function() {
    var body = {
      target_user_id: channelData.id
    }

    var returnObject = apiRequest("POST", body, "subscription/", userData.token);
    //console.log(returnObject);

    // error handling
    if (returnObject.statusCode != 200) {
      return;
    }

    // update subscription data
    subscriptionData = returnObject.response;

    // toggle the buttons
    $('#subscribe').hide();
    $('#unsubscribe').show();
  });

  // function to unsubscribe
  $('#unsubscribe').on('click', function() {
    var returnObject = apiRequest("DELETE", null, "subscription/" + subscriptionData.id, userData.token);
    //console.log(returnObject);

    // error handling
    if (returnObject.statusCode != 200) {
      return;
    }

    // update subscription data
    subscriptionData = null;

    // toggle the buttons
    $('#subscribe').show();
    $('#unsubscribe').hide();
  });

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

    // send a request to get video information
    videoData = loadVideoData(getUrlId());
    
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
    responseObject = apiRequest("GET", null, "user/" + videoData.user_id + "?load=subscribers", userData.token);
    //console.log(responseObject);
    channelData = responseObject.response;

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
  
});
