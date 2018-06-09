
var AjaxUtils = {
  
  DeleteByID : function(url, key) {

    $.ajax({
      url: url,
      type: "DELETE",
      headers: { 'Authorization': key },
      statusCode: {
        401: function() {
          window.location = "/me/login";
        },
        400: function(o) {
          alert(o.error);
        },
        200: function(o) {
          window.location = "/composer/" + key;
        }
      }
    });
  }
}
