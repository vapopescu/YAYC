$(document).ready( () => {

  // function to insert comments
  $('#comment').on('click', (e) => {
    e.preventDefault();
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
  $('#like-fa').on('click', (e) => {
    var nr = $('#likes').text();
    nr = parseInt(nr)+1;
    $("#likes").text(nr);
  });
  
  // function to add dislikes
  $('#dislike-fa').on('click', (e) => {
    var nr = $('#dislikes').text();
    nr = parseInt(nr)+1;
    $("#dislikes").text(nr);
  });
  
  // function to load content
  var loadContent = function() {
    // load user data
    var userData = loadUserData();

    // get the video id from the url
    var video_id = getUrlParameter("id");

    if (video_id === undefined) {
      alert("Non-existent video id.");
      return;
    }

    // send a request to get video information
    var videoDetails = apiRequest("GET", null, "video/" + video_id + "?load=user,votes,comments", userData.token);
    console.log(videoDetails);

    // error handling
    if (videoDetails.statusCode == 404) {
      alert("Invalid video id.");
      return;
    }
    
    // populate the page
    $("#title").text(videoDetails.response.name);
    $("#main-video").attr("src", videoDetails.response.video_url);
    $("#channel-avatar").attr("src", videoDetails.response.user.avatar_url);
    $("#views").text(videoDetails.response.view_count);
    $("#likes").text(videoDetails.response.likes);
    $("#dislikes").text(videoDetails.response.dislikes);
    $("#channel-name").text(videoDetails.response.user.name);
    $("#description").text(videoDetails.response.description);
    $("#upload-date").text($.format.date(videoDetails.response.created_at, "MMM dd, yyyy"));
  }
  
  loadContent();
  
});
