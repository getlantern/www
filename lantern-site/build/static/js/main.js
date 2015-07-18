$(document).ready(function(){
  $('.question a').click(function(){
    $(this).closest('div').toggleClass('show');
    return false;
  });
});
