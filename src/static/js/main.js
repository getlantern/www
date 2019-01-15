$(document).ready(function(){
  $('.carousel').slick && $('.carousel').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    arrows: false,
  });

  $('.question a').click(function(){
    $(this).closest('div').toggleClass('show');
    return false;
  });


  function DropDown(el) {
    this.dd = el;
    this.initEvents();
  }
  DropDown.prototype = {
    initEvents : function() {
      var obj = this;

      obj.dd.on('click', function(event){
        $(this).toggleClass('active');
        event.stopPropagation();
      });	
    }
  }

  $(function() {

    var dd = new DropDown( $('#dd') );

    $(document).click(function() {
      // all dropdowns
      $('.select-dropdown').removeClass('active');
    });

  });

  var hideNotice = "hide-notice-" + window.location.pathname;
  var show = true;
  if (show && window.localStorage.getItem(hideNotice)) {
    show = false;
  }
  if (show) {
    $("#notice").show();
    $("#notice #close-notice").click(function() {
      $("#notice").hide();
      window.localStorage.setItem(hideNotice, true);
    });
  } else {
    $("#notice").hide();
  }
});

