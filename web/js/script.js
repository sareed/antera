$(document).ready(function(){

  // HOVERCARDS
  var Hovercard = {
    
    timer: null,
    focusOn: null,
    card: $("#hovercard"),
    
    show: function(focusOn) {
      var delay = 300;
      this.focusOn = focusOn;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(function() {
        window.hovercard.showNow();
      }, delay);
    },
    
    showNow: function() {
      
      // focus on this element
      if (!this.focusOn) { return; }
      var el = $(this.focusOn);
      
      // fill out card
      $("h2", this.card).html( el.attr("hover_title") );      
      $(".subtitle", this.card).html( el.attr("hover_subtitle").replace('www.', '') );
      $(".description", this.card).html( el.attr("hover_description") );
      
      // positioning
      var card_w = 300;
      var below = 6;
      var offset = el.offset();
      var el_w = el.outerWidth();
      var el_h = el.outerHeight();
      this.card.css({
        top: offset.top + el_h + below,
        left: offset.left - card_w/2 + el_w/2,
      });
      
      // show
      this.card.show();
      this.timer = null;
    },
    
    hide: function() {
      this.card.hide();
      clearTimeout(this.timer);
      this.timer = null;
    },
    
  };
  window.hovercard = Hovercard;
  $(".has-hovercard").mouseenter(function() {
    Hovercard.show(this);
  });
  $(".has-hovercard").mouseleave(function() {
    Hovercard.hide();
  });

  // SCRIPTS FOR EACH PAGE
  var onPageLoad = {}

  // HOMEPAGE
  onPageLoad["homepage"] = function() {
    // Slide Show
    $(".brick .slides").slides({
        preload: false,
        pagination: false,
        generatePagination: false,
        slideSpeed: 300,
    });
    // Click on bricks
    $(".brick").click(function(e) {
      if ($(e.target).hasClass("clickable")) {
        return false;
      }
      var url = $(this).find("h2 a").attr('href');
      if (url) {
        document.location = url;
      }
    });
    // Twitter brick
    var twitterUrl = "//api.twitter.com/1/statuses/user_timeline.json?";
    var twitterData = {
      screen_name: "googleventures",
      /* count: 1, //TODO: Why doesn't this work? */
      include_rts: 0,
      trim_user: 1,
    };
    $.ajax({
      url: twitterUrl,
      data: twitterData,
      dataType: 'jsonp',
      success: function(data) {
        var tweet = data[0];
        var brick = $("#tweet-brick");
        if (!tweet || !tweet.text) { return; }
        var text = tweet.text.replace(
          /(http(s?):\/\/(\S+))(\s|$)/g,
          '<a href="$1">$3</a>');
        $(".text-block",brick).html( text );
        brick.show();
      },
    })
    $("#tweet-brick").click(function(e){
      if (e.target.nodeName == "A") {
       return true;
      }
      var url = "http://twitter.com/intent/user?screen_name=googleventures";
      window.open(url, '','height=350,width=550');
    })
  }
  
  // HANDS ON TEAMS
  onPageLoad["hands-on"] = function() {    
    var subnav = $(".subnav");
    var pinned = subnav.clone();
    pinned.appendTo("body");
    pinned.addClass("pinned").hide();    
    var shown = false;
    var navPosition = subnav.offset().top + 5;
    var win = $(window);
    $(window).scroll(function() {
      var scroll = win.scrollTop();
      if (scroll > navPosition) {
        if (!shown) {
          pinned.show();
          shown = true;
        }
      }
      else {
        if (shown) {
          pinned.hide();
          shown = false;
        }
      }
    })
  };
  
  // TEAM & TEAM-MEMBER
  // PLACEHOLDERS FOR MISSING PHOTOS
  onPageLoad["team"] = onPageLoad["team-member"] = function() {
    $(".photo img").on("error", function() {
      $(this).off('error');
      $(this).attr('src', '/img/team-profile/_missing.png');
    });
    $("img.thumbnail").on("error", function() {
      $(this).off('error');
      $(this).attr('src', '/img/team-thumbnail/_missing.png');
    });
  }
  
  // COMPANIES
  onPageLoad["companies"] = function() {
    var companies = $(".company-list a");
    var filters = $(".company-filter a");
    // Actions on filters
    filters.click(function() {
      filters.removeClass("selected");
      $(this).addClass("selected");
      var filter = $(this).attr("filter");
      if (filter) {
        companies.not(filter).addClass("disabled");
        $(".company-list a." + filter).removeClass("disabled");
      }
      else {
        companies.removeClass("disabled");
      }
      return false;
    })  
  }

  // SUBSCRIBE TO STARTUP LAB
  onPageLoad["startup-lab-subscribe"] = function() {
    var input = $(".email-input");
    var button = $(".subscribe .button");
    var eg = $(".subscribe .eg");
    input.on("keyup", function() {
      var email = input.attr("value");
      email = email.replace(/\s+$/, '');
      if (email.match(/(gmail\.com|yahoo\.com|hotmail\.com|\.edu)$/i)) {
        button.attr("disabled","disabled");
        eg.addClass("highlight");
      }
      else {
        button.removeAttr("disabled");
        eg.removeClass("highlight");
      }
    })
  }

  // TRIGGER SCRIPTS FOR EACH PAGE
  var page = document.body.id;
  if (page in onPageLoad) {
    onPageLoad[page]();
  }
  
});
