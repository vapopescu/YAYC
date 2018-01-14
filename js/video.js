var userData = null;
var videoDetails = null;
var channelDetails = null;
var subscription_id = null;

$(document).ready( () => {

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

  // function to add likes
  $('#like-fa').on('click', () => {
    var nr = $('#likes').text();
    nr = parseInt(nr)+1;
    $("#likes").text(nr);
  });
  
  // function to add dislikes
  $('#dislike-fa').on('click', () => {
    var nr = $('#dislikes').text();
    nr = parseInt(nr)+1;
    $("#dislikes").text(nr);
  });
  
  // function to subscribe
  $('#subscribe').on('click', () => {
    var body = {
      target_user_id: channelDetails.response.id
    }

    var returnObject = apiRequest("POST", body, "subscription/", userData.token);
    //console.log(returnObject);

    if (returnObject.statusCode != 200) {
      return;
    }

    subscription_id = returnObject.response.id;

    $('#subscribe').hide();
    $('#unsubscribe').show();
  });

  // function to unsubscribe
  $('#unsubscribe').on('click', () => {
    var returnObject = apiRequest("DELETE", null, "subscription/" + subscription_id, userData.token);
    //console.log(returnObject);

    if (returnObject.statusCode != 200) {
      return;
    }

    $('#subscribe').show();
    $('#unsubscribe').hide();
  });

  // function to load content
  var setup = function() {
    // load user data
    userData = loadUserData();

    // get the video id from the url
    var video_id = getUrlId();

    // send a request to get video information
    videoDetails = apiRequest("GET", null, "video/" + video_id + "?load=votes,comments", userData.token);
    console.log(videoDetails);

    // error handling
    if (videoDetails.statusCode != 200) {
      alert("Invalid video id.");
      return;
    }
    
    // populate the page
    $("#title").text(videoDetails.response.name);
    $("#main-video").attr("src", videoDetails.response.video_url);
    $("#views").text(videoDetails.response.view_count);
    $("#likes").text(videoDetails.response.likes);
    $("#dislikes").text(videoDetails.response.dislikes);
    $("#description").text(videoDetails.response.description);
    $("#upload-date").text($.format.date(videoDetails.response.created_at, "MMM dd, yyyy"));

    // send a request to get channel information
    channelDetails = apiRequest("GET", null, "user/" + videoDetails.response.user_id + "?load=subscribers", userData.token);
    console.log(channelDetails);

    // populate the page
    $("#channel-avatar").attr("src", channelDetails.response.avatar_url);
    $("#channel-name").text(channelDetails.response.name);

    // get the channel subscribel list
    var subs = channelDetails.response.subscribers;

    // check if the user is subscribed
    for (var i = 0; i < subs.length; i++) {
      if (subs[i].source_user_id == userData.id) {
        subscription_id = subs[i].id;
        break;
      }
    }

    // show the corresponding button
    if (subscription_id == null) {
      $("#subscribe").show();
    } else {
      $("#unsubscribe").show();
    }

  }
  
  setup();
  
});
