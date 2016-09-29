$(document).ready(function(){

  var ANDROID_LINK = "https://s3.amazonaws.com/lantern/lantern-installer-beta.apk";

  
  $('#close-notice').click(function(){
    $('#notice').hide();
    return false;
  });
  
  $('a#on-mobile').click(function(){
    $('.send-link').toggle('slow');
    return false;
  });

  var template_map = {
    "fa-IR": "download-link-from-lantern-website-fa-ir",
    "zh-CN": "download-link-from-lantern-website-zh-cn"
  };

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
      $("#download-android-button").attr("href", ANDROID_LINK);
      if (platform.os.family === "Android") {
          $("#download-android").css("display", "block");
          $("#other-systems").css("display", "block");
          $("#download-android-button").before($("#download-button"));
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

  var check_rtl = function() {
      var lang = $("#language-chooser").val();
      if(lang == "fa_IR") {
          $("html").attr("dir", "rtl");
      }else{
          $("html").attr("dir", "ltr");
      }
  };

  var change_gplay_barge = function() {
      var lang = $("#language-chooser").val();
      $("#gplay_badge").attr("src", "/static/images/gplay/"+lang+".png");
  };

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
    $("#language-chooser").change(function() {
      var lang = $(this).find("option:selected").val() || "en";
      $("[data-localize]").localize("/static/locale/lang", { language: lang });
      if (Modernizr.localstorage) {
          window.localStorage.setItem("lang", lang);
      }
      on_change_lang(lang);
    });

    if (Modernizr.localstorage) {
        lang = window.localStorage.getItem("lang");
    }

    $("#language-chooser").val(lang || "en_US");

    $("[data-localize]").localize("/static/locale/lang", {language: lang });
    on_change_lang(lang);
  };

  var on_change_lang = function(lang) {
      check_rtl();
      change_gplay_barge();
      show_notice(lang);
  };

  var show_notice = function(lang) {
      var show = false;
      if (lang === 'zh_CN') {
          show = true;
          if (Modernizr.localstorage && window.localStorage.getItem("hide-notice")) {
              show = false;
          }
      }

      if (show) {
          $("#notice").show();
          $("#notice #close-notice").click(function() {
              // uncomment to remember visitor's choice
              /*if (Modernizr.localstorage) {
                window.localStorage.setItem("hide-notice", true);
                }*/
              $("#notice").hide();
          });
      } else {
          $("#notice").hide();
      }
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
