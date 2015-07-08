$(function() {
  mandrill_client = new mandrill.Mandrill('fmYlUdjEpGGonI4NDx9xeA');
  var template_name = "download-link-from-lantern-website";
  var template_content = [{
    "name": "example name",
    "content": "example content"
  }];
  var from_email = "admin@getlantern.org";
  var from_name = "Lantern";
  var subject = "Your Lantern download link";
  var code = "<div>example code</div>";
  var text = "Example text content";
  var publish = false;
  var labels = [
    "example-label"
  ];
});
