$(document).ready(function(){

  var ANDROID_LINK = "lantern-installer.apk";

  var set_download_link = function() {
    var os = platform.os.architecture + platform.os.family;
    var os_links = [
      {regexp: "[2-6]{2}[Ww]indows", link: "lantern-installer.exe"},
      {regexp: "[2-6]{2}OS X", link: "lantern-installer.dmg"},
      // for Android devices with large screen
      {regexp: ".*Android", link: ANDROID_LINK},
      {regexp: "32.*", link: "lantern-installer-32-bit.deb"},
      {regexp: "64.*", link: "lantern-installer-64-bit.deb"},
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
      var downloadBtn = document.getElementById("download-button");
      $("#download-android").css("display", "block");
      $("#other-systems").css("display", "block");
      $("#download-android-button").after(downloadBtn);
    }
  };

  var update_version_number = function() {
    $.get("version-beta.txt", function(version) {
      version = version.trim();
      if (version.match(/^(\d+\.)?(\d+\.)?(\*|\d+)$/)) {
        $("#version-number").text(version);
        $("#current-version").css("visibility", "visible");
      }
    });
  };

  set_download_link();
  prepare_android_download();
  update_version_number();
});
