var channelData = null;
var subscriptionData = null;

$(document).ready(function() {
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
});
