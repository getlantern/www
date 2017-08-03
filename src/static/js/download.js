$(document).ready(function(){

  var set_download_link = function(cls, link) {
    $('.'+cls).attr('href', link);
    $('.'+cls).on('click', function() {
      ga('send', 'event', 'button', 'click', cls);
    });
  };
  var os = platform.os.architecture + platform.os.family;
  var os_links = [
    {regexp: "[2-6]{2}[Ww]indows", link: "../lantern-installer.exe"},
    {regexp: ".*Android", link: "../lantern-installer.apk"},
    {regexp: "[2-6]{2}OS X", link: "../lantern-installer.dmg"},
    {regexp: "32.*", link: "../lantern-installer-32-bit.deb"},
    {regexp: "64.*", link: "../lantern-installer-64-bit.deb"},
    {regexp: ".*", link: "https://github.com/getlantern/lantern#lantern-"}
  ];
  set_download_link('download-windows', os_links[0].link);
  set_download_link('download-android', os_links[1].link);
  set_download_link('download-mac', os_links[2].link);
  // 64 bit is mainstream now
  set_download_link('download-ubuntu', os_links[4].link);

  for (i = 0; i < os_links.length; ++i) {
    re = new RegExp(os_links[i].regexp);
    if (os.match(re)) {
      set_download_link('download-btn', os_links[i].link);
      set_download_link('download', os_links[i].link);
      break;
    }
  }
});
