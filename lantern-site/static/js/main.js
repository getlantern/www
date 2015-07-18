$(document).ready(function(){

  var template_map = {
    "fa-IR": "download-link-from-lantern-website-fa-ir",
    "zh-CN": "download-link-from-lantern-website-zh-cn"
  };

  var set_download_link = function() {
    var os = platform.os.architecture + platform.os.family;
    var os_links = [
      {regexp: "[2-6]{2}[Ww]indows", link: "https://s3.amazonaws.com/lantern/lantern-installer-beta.exe"},
      {regexp: "[2-6]{2}OS X", link: "https://s3.amazonaws.com/lantern/lantern-installer-beta.dmg"},
      {regexp: "32.*", link: "https://s3.amazonaws.com/lantern/lantern-installer-beta-32.deb"},
      {regexp: "64.*", link: "https://s3.amazonaws.com/lantern/lantern-installer-beta-64.deb"},
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

  var init_mandrill = function() {
    var mandrill_client = new mandrill.Mandrill('fmYlUdjEpGGonI4NDx9xeA');
    var lang = navigator.language || navigator.userLanguage;
    var template_name = template_map[lang] || "download-link-from-lantern-website";
    var template_content = [{
      "name": "example name",
      "content": "example content"
    }];
    $("#send-download-form").on("submit", function(event) {
      var email = $("#send-download-link-email").val();
      if (email) {
        var message = {
          "to": [
            { "email": email }
          ]
        };
        mandrill_client.messages.sendTemplate({
          "template_name": template_name,
          "template_content": template_content,
          "message": message
        });
        $("#send-download-form").hide();
        $("#thanks-after-email").fadeIn("slow");
      }
      event.preventDefault();
    });
  };

  var language_chooser = function() {
    var lang = "en";

    $("#language-chooser").change(function() {
      var lang = $(this).find("option:selected").val() || "en";
      $("[data-localize]").localize("/static/locale/lang", { language: lang });
      if (Modernizr.localstorage) {
        window.localStorage.setItem("lang", lang);
      }
    });

    if (Modernizr.localstorage) {
      lang = window.localStorage.getItem("lang");
      if (lang) {
        $("#language-chooser").val(lang);
      }
    };

    $("[data-localize]").localize("/static/locale/lang", {language: lang});
  };

  $('.question a').click(function(){
    $(this).closest('div').toggleClass('show');
    return false;
  });

  set_download_link();
  init_mandrill();
  language_chooser();
});
