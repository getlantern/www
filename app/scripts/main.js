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
  var os = platform.os.architecture + platform.os.family;
  var os_links = [
    {regexp: "[2-6]{2}[Ww]indows", link: "https://s3.amazonaws.com/lantern/lantern-installer-beta.exe"},
    {regexp: "OS X", link: "https://s3.amazonaws.com/lantern/lantern-installer-beta.dmg"},
    {regexp: "32Linux", link: "https://s3.amazonaws.com/lantern/lantern-installer-beta-32.deb"},
    {regexp: "64Linux", link: "https://s3.amazonaws.com/lantern/lantern-installer-beta-64.deb"}
  ];
  for (i = 0; i < os_links.length; ++i) {
    re = new RegExp(os_links[i].regexp);
    if (os.match(re)) {
      $("#download-button").attr("href", os_links[i].link);
    }
  }
});
