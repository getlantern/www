$(document).ready(function(){

var ANDROID_LINK = "https://s3.amazonaws.com/lantern-android/lantern-android-beta.apk";

  var set_download_link = function() {
    var os = platform.os.architecture + platform.os.family;
    var os_links = [
      {regexp: "[2-6]{2}[Ww]indows", link: "https://s3.amazonaws.com/lantern/lantern-installer-beta.exe"},
      {regexp: "[2-6]{2}OS X", link: "https://s3.amazonaws.com/lantern/lantern-installer-beta.dmg"},
      {regexp: "32.*", link: "https://s3.amazonaws.com/lantern/lantern-installer-beta-32-bit.deb"},
      {regexp: "64.*", link: "https://s3.amazonaws.com/lantern/lantern-installer-beta-64-bit.deb"},
      // for Android devices with large screen
      {regexp: "Android", link: ANDROID_LINK},
      {regexp: ".*", link: "https://github.com/getlantern/lantern#lantern-"}
    ];
    for (i = 0; i < os_links.length; ++i) {
      re = new RegExp(os_links[i].regexp);
      if (os.match(re)) {
        $("#download-button").attr("href", os_links[i].link);
        break;
      }
    }

    $('#download-button').on('click', function() {
      ga('send', 'event', 'button', 'click', 'download');
    });
  };

  var prepare_android_download = function() {
    if (platform.os.family === "Android") {
      $("#download-android-button").attr("href", ANDROID_LINK);
      $("#download-android").css("display", "block");
    }
  };
  var init_mandrill = function() {
    var template_map = {
      "fa-IR": "download-link-from-lantern-website-fa-ir",
      "zh-CN": "download-link-from-lantern-website-zh-cn"
    };

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

  var check_rtl = function() {
    var lang = $("#language-chooser").val();
    if(lang == "fa_IR") {
      $("html").attr("dir", "rtl");
    }else{
      $("html").attr("dir", "ltr");
    };
  }

  var update_version_number = function() {
    var last_release = "https://api.github.com/repos/getlantern/lantern/releases/latest";
    $.getJSON(last_release, function(data) {
      if (data.tag_name) {
        $("#version-number").text(data.tag_name);
        $("#current-version").css("visibility", "visible");
      }
    });
  };

  var language_chooser = function() {
    var lang;

    $("#language-chooser").change(function() {
      var lang = $(this).find("option:selected").val() || "en";
      $("[data-localize]").localize("/static/locale/lang", { language: lang });
      if (Modernizr.localstorage) {
        window.localStorage.setItem("lang", lang);
      }
      check_rtl();
    });

    if (Modernizr.localstorage) {
      lang = window.localStorage.getItem("lang");
    }

    $("#language-chooser").val(lang || "en_US");

    check_rtl();

    $("[data-localize]").localize("/static/locale/lang", {language: lang });
  };

  $('.question a').click(function(){
    $(this).closest('div').toggleClass('show');
    return false;
  });

  set_download_link();
  prepare_android_download();
  init_mandrill();
  language_chooser();
  update_version_number();
});
