(function() {
  var template_map = {
    "fa-IR": "download-link-from-lantern-website-fa-ir",
    "zh-CN": "download-link-from-lantern-website-zh-cn"
  };
  var init_mandrill = function() {
    var mandrill_client = new mandrill.Mandrill('fmYlUdjEpGGonI4NDx9xeA');
    var lang = navigator.language || navigator.userLanguage;
    var template_name = template_map[lang] || "download-link-from-lantern-website";
    var template_content = [{
      "name": "example name",
      "content": "example content"
    }];
    $("#send-download-link-button").click(function(event) {
      event.preventDefault();
      var email = $("#send-download-link-email").val();
      var message = { "to": [ { "email": email } ] };
      mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message});
    });
  };

  var set_download_link = function() {
    var os = platform.os.architecture + platform.os.family;
    var os_links = [
      {regexp: "[2-6]{2}[Ww]indows", link: "https://s3.amazonaws.com/lantern/lantern-installer.exe"},
      {regexp: "[2-6]{2}OS X", link: "https://s3.amazonaws.com/lantern/lantern-installer.dmg"},
      {regexp: "32.*", link: "https://s3.amazonaws.com/lantern/lantern-installer-32.deb"},
      {regexp: "64.*", link: "https://s3.amazonaws.com/lantern/lantern-installer-64.deb"},
      {regexp: ".*", link: "https://github.com/getlantern/lantern/wiki/Lantern-Beta-Versions#download-links"}
    ];
    for (i = 0; i < os_links.length; ++i) {
      re = new RegExp(os_links[i].regexp);
      if (os.match(re)) {
        $("#download-button").attr("href", os_links[i].link);
        break;
      }
    }
  };

  $(function() {
    set_download_link();
    init_mandrill();
    $("[data-localize]").localize("locale/lang");
  });
})();
