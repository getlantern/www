$(document).ready(function(){

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

  init_mandrill();


  language_chooser();
});
