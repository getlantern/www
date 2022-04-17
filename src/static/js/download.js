$(document).ready(function(){
  var ua = new UAParser();
  var cpu = ua.getCPU();
  var os = ua.getOS();

  var set_download_link = function(cls, link) {
    $('.'+cls).attr('href', link);
    $('.'+cls).on('click', function() {
      ga('send', 'event', 'button', 'click', cls);
    });
  };
  var os_links = [
    {os: "Windows", cpu: "ia32", link: "../lantern-installer-32-bit.exe"},
    {os: "Windows", cpu: "amd64", link: "../lantern-installer-64-bit.exe"},
    {os: "Android", link: "../lantern-installer.apk"},
    {os: "Mac OS", link: "../lantern-installer.dmg"},    
    {os: "Linux", cpu: "ia32", link: "../lantern-installer-32-bit.deb"},
    { os: "Linux", cpu: "amd64", link: "../lantern-installer-64-bit.deb" },
    {link: "https://github.com/getlantern/lantern#lantern-"}
  ];
  set_download_link('download-windows-32', os_links[0].link);
  set_download_link('download-windows-64', os_links[1].link);
  set_download_link('download-android', os_links[2].link);
  set_download_link('download-mac', os_links[3].link);
  set_download_link('download-ubuntu-64', os_links[5].link);
  set_download_link('download-ubuntu-32', os_links[4].link);

  for (i = 0; i < os_links.length; ++i) {
    const l = os_links[i];
    const os_ok = !l.os || (l.os === os.name);
    const arch_ok = !l.cpu || (l.cpu === cpu.architecture);
    console.log("comparing", l.os, os.name, l.cpu , cpu.architecture)
    if (os_ok && arch_ok) {
      set_download_link('download-btn', l.link);
      set_download_link('download', l.link);
      break;
    }
  }
});
