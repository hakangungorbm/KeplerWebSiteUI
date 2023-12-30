/*Ilgili DIV ler ekrana geldiginde swipe effecti icin sinif eklenmesini sagliyor */

var isInViewport = function (elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();
  if ($(elem).offset()) {
      var elemTop = $(elem).offset().top;
      var elemBottom = elemTop + $(elem).height();
      return ((elemBottom <= docViewBottom + 500) && (elemTop >= docViewTop - 500));
  }
}

var effectArea = document.querySelectorAll('.introducing-area-wide-wrapper, .block-area, .mp-static-review-text-area, .offer-content-wrapper');
var blockImage = document.querySelectorAll('.block-area-image');

window.addEventListener('scroll', function (event) {
  // add event on scroll
  effectArea.forEach(element => {
      //for each .thisisatest
      if (isInViewport(element)) {
          //if in Viewport
          element.classList.add("active");
      }
  });

  blockImage.forEach(element => {
      //for each .thisisatest
      if (isInViewport(element)) {
          //if in Viewport
          element.classList.add("lazyloaded");
      }
  });


}, false);

/*Filter Gallery */

var fActive;

function filterGallery(category) {
  if (fActive != category) {
      $('#category-wrapper .row').filter('.' + category).slideDown();
      $('#category-wrapper .row').filter(':not(.' + category + ')').slideUp();
      fActive = category;
      $('button').removeClass("active");
  }
}

$('.f-entrance').click(function () { filterGallery('entrance'); $(this).addClass("active"); });
$('.f-lockerRoom').click(function () { filterGallery('lockerRoom'); $(this).addClass("active"); });
$('.f-showersAndBathroom').click(function () { filterGallery('showersAndBathroom'); $(this).addClass("active"); });
$('.f-restingUnit').click(function () { filterGallery('restingUnit'); $(this).addClass("is-active"); });
$('.f-salon').click(function () { filterGallery('salon'); $(this).addClass("active"); });

$('.f-all').click(function () {
  $('#category-wrapper .row').slideDown();
  fActive = 'all';
  $('.menu button').removeClass("active");
  $(this).addClass("active");
});



/*SCROOL ISLEMI BASLAYINCA UST MENUYU FIXED YAPAN KOD*/

$(window).scroll(function () {
  if ($(this).scrollTop() > 0) {
      $('#header-menu').addClass('navbar-fixed-top');
      $('.top-menu').css('display', 'none');
  } else {
      $('#header-menu').removeClass('navbar-fixed-top');
      $('.top-menu').css('display', 'block');
  }

  // Asagi yonlu 500 px scroll yapilinca logonun kucuk logo ile degismesi icin class ekliyorum
  if ($(this).scrollTop() > 250) {
      $('.navbar-brand').addClass('kepler-logo');
      $('#header-menu').css("background-color", "#453D98");
  } else {
      $('.navbar-brand').removeClass('kepler-logo');
      $('#header-menu').css("background-color", "transparent");
  }


  //content-scrool-menu kendini ana menunun altina fixlesin diye script
  if ($(this).scrollTop() > 700) {
      var sliderElement = document.querySelectorAll('.header-menu-wrapper');
      var headerMenuHeight = sliderElement[0].clientHeight;
      $('.content-scrool-menu').addClass('navbar-fixed-top');
      $('.content-scrool-menu').css('top', headerMenuHeight);
  } else {
      $('.content-scrool-menu').removeClass('navbar-fixed-top');
  }

  //arasayfalar-scrool-menu kendini ana menunun altina fixlesin diye script
  if ($(this).scrollTop() > 700) {
      var sliderElement = document.querySelectorAll('.header-menu-wrapper');
      var headerMenuHeight = sliderElement[0].clientHeight;
      $('.arasayfalar-scrool-menu').addClass('navbar-fixed-top');
      $('.arasayfalar-scrool-menu').css('top', headerMenuHeight);
  } else {
      $('.arasayfalar-scrool-menu').removeClass('navbar-fixed-top');
  }


});



/*######### ANASAYFA ANA SLIDER ##################*/
var paginationText = ['SAW', 'MLY', 'LTV']
const main_text_slider = new Swiper('.main-text-slider', {
  loop: true,
  speed: 100,
  effect: 'fade',
  slidesPerView: 1
});
const main_image_slider = new Swiper('.main-image-slider', {
  parallax: true,
  speed: 1000,
  watchSlidesProgress: true,
  reverseDirection: true,
  disableOnInteraction: true,
  grabCursor: true,
  pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (paginationText[index]) + "</span>";
      },
  },
  thumbs: {
      swiper: main_text_slider,
  }
});
$('.swiper-pagination .swiper-pagination-bullet').hover(function () {
  $(this).trigger("click");
});


/*CONCEPT ve RESTING UNITS bolumlerindeki GALLERY SLIDERLARI*/
const concept_gallery_slider = new Swiper('.content-gallery-slider', {
  parallax: true,
  speed: 2000,
  watchSlidesProgress: true,
  reverseDirection: true,
  disableOnInteraction: true,
  grabCursor: true,
  pagination: {
      el: '.content-gallery-swiper-pagination',
      clickable: true
  }
});
$('.content-gallery-swiper-pagination .swiper-pagination-bullet').hover(function () {
  $(this).trigger("click");
});


/*INTRODUCE SLIDER */
const introduce_slider = new Swiper('.introduce-slider', {
  slidesPerView: 1,
  spaceBetween: 20,
  breakpoints: {
      768: {
          slidesPerView: 2,
          spaceBetween: 10,
      },
      992: {
          slidesPerView: 1,
          spaceBetween: 10,
      },
      1024: {
          slidesPerView: 1,
          spaceBetween: 10,
      },
      1200: {
          slidesPerView: 1,
          spaceBetween: 20,
      },
      1500: {
          slidesPerView: 2,
          spaceBetween: 20,
      },
      2024: {
          slidesPerView: 2,
          spaceBetween: 20,
      },
  },
  navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
  },
});


/*######### ANASAYFA BOOK SESSION SLIDER ##################*/
const sliderThumbs = new Swiper(".slider__thumbs .swiper-container", {
  direction: "vertical",
  slidesPerView: 3,
  spaceBetween: 24,
  freeMode: true,
  breakpoints: {
      0: {
          direction: "horizontal",
          slidesPerView: 1,
      },
      750: {
          direction: "vertical",
          slidesPerView: 1,
      }
  }
});

const sliderImages = new Swiper(".slider__images .swiper-container", {
  direction: "vertical",
  parallax: true,
  speed: 1000,
  slidesPerView: 1,
  parallax: true,
  // mousewheel: true, 
  grabCursor: true,
  thumbs: {
      swiper: sliderThumbs
  },
  pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + "</span>";
      },
  },
  navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
  },
  breakpoints: {

      0: {
          direction: "horizontal"
      },
      751: {
          direction: "vertical"
      }
  }
});
$('.swiper-pagination-bullet').hover(function () {
  $(this).trigger("click");
});


/*######### ANASAYFA LOGO SLIDER ##################*/

var swiper = new Swiper(".kepler-logo-slider", {
  scrollbarHide: true,
  slidesPerView: 'auto',
  autoplay: true,
  autoplay: {
      delay: 0.5,
      disableOnInteraction: false,
  },
  speed: 10000,
  grabCursor: false,
  loop: true,
  preloadImages: false,
  scrollbarDraggable: true,
  lazyLoading: true,
  preventClicks: false,
  preventClicksPropagation: false
});

/*######### ANASAYFA REVIEWER SLIDER ##################*/
var swiper = new Swiper('.review-slider', {
  spaceBetween: 30,
  slidesPerView: 1,
  effect: 'fade',
  speed: 1500,
  loop: true,
  mousewheel: {
      invert: false,
  },
  fadeEffect: {
      crossFade: true
  },
  centeredSlides: true,
  // autoHeight: true,
  pagination: {
      el: '.review-slider-pagination',
      clickable: true,
  }
});
$('.review-slider-pagination .swiper-pagination-bullet').hover(function () {
  $(this).trigger("click");
});


/*Resting Units Description alani tooltip scriptleri*/
$(".tooltip-container").bind("click", function () {
  var tooltip = $(this).find(".unit-tooltip");
  var unitmark = $(this).find(".unit-mark");
  if ($(this).find(".unit-tooltip").hasClass("ems-none") && $(this).find(".unit-mark").hasClass("animated")) {
      $(".tooltip-container").find(".unit-tooltip").addClass("ems-none");
      $(".tooltip-container").find(".unit-mark").addClass("animated");
      tooltip.removeClass("ems-none");
      unitmark.removeClass("animated");
  } else {
      $(".tooltip-container").find(".unit-tooltip").addClass("ems-none");
      $(".tooltip-container").find(".unit-mark").addClass("animated");
  }
});


jQuery(document).ready(function ($) {

  /*CONTENT SCROLL MENU'NUN LI SI ALTINDAKI A ELEMENTIDEN HERHANGI BIRISI CLICK OLUNCA BU A ELEMENTININ PARENT LI'SI ACTIVE CLASS'INI ALSIN DIYE KOD */
  $(document).on('click', '.content-scrool-menu .menu li a', function (event) {
      /*smoot scroll */
      event.preventDefault();
      var target = this.hash;
      var $target = $(target);
      $('html, body').stop().animate({
          'scrollTop': $target.offset().top - 300
      }, 1000, 'swing', function () {
      });

      /*menu underline */
      $('.menu li').removeClass('active');
      $(this).parent().addClass('active');
  });

  /*Slider uzerÄ±nde bulunan scrollto butonuna basÄ±nca bir div asagi kaymasi icin script */
  $(document).on('click', '.scroll-down-wrapper a', function (event) {
      /*smoot scroll */
      event.preventDefault();
      var target = this.hash;
      var $target = $(target);
      $('html, body').stop().animate({
          'scrollTop': $target.offset().top - 70
      }, 1000, 'swing', function () {
      });
  });



  //ReadMode - Read Less button islemleri
  $(".button-wrapper").click(function (e) {

      if ($('#text-and-button-wrapper').hasClass('expand-text')) {
          $('#text-and-button-wrapper').removeClass('expand-text');
          $('#text-and-button-wrapper').addClass('less-text');
      } else {
          if ($('#text-and-button-wrapper').hasClass('less-text')) {
              $('#text-and-button-wrapper').removeClass('less-text');
              $('#text-and-button-wrapper').addClass('expand-text');

              var sliderElement = document.querySelectorAll('.content-top-text');
              var target = sliderElement[0];
              var $target = $(target);

              $('html, body').stop().animate({
                  'scrollTop': $target.offset().top - 200
              }, 1000, 'swing', function () {
              });
          }
      }
      e.preventDefault();
  });


  /*DROPDOWN MENU HOVER OLUNCA OPEN CLASS INI ALSIN, IMLECI CEKINCE GERI SILINSIN DIYE KOD */
  $(".dropdown").hover(function () {
      var dropdownMenu = $(this).children(".dropdown-menu");
      if (dropdownMenu.is(":visible")) {
          dropdownMenu.parent().toggleClass("open");
          $(".pin").css("opacity", "1");
      }
      if (dropdownMenu.css('display') === 'none') {
          $(".pin").css("opacity", "0");
      }
  });


  /*BOOK SLIDER DIV ININ YUKSEKLIGINI ICINDEKI FOTOGRAFIN YUKSEKLIGINE GORE AYARLAMAK ICIN SCRIPT*/
  var sliderElement = document.querySelectorAll('.slider__images .swiper-slide-visible');
  if (sliderElement.length > 0) {
      var sliderElementWidth = sliderElement[0].clientWidth;
  }
  var ekranWidth = $(window).width();

  if (sliderElementWidth > 733 && ekranWidth > 733) {
      var imageHeight = $('.swiper-slide-visible .slider__image .book-slider-image').height();
      $('.slider__images').css("height", imageHeight);
  } else {
      var imageHeight = $('.swiper-slide-visible .slider__image .book-slider-image-mobile').height();
      $('.slider__images').css("height", imageHeight);
  }



  $('.fancybox').fancybox();


  /* Mobile Menu acilinca scroll engelle ve menu header a background ekleme script */
  $('.navbar-toggle').click(function (e) {
      if ($(this).hasClass('collapsed')) {
          $(this).removeClass('kapali-mobil-menu');
          $(this).addClass('acik-mobil-menu');
          $(this).parent().addClass('add-background-color');
          $('body').css('overflow', 'hidden');  // scroll engelle
      } else {
          $(this).removeClass('acik-mobil-menu');
          $(this).parent().removeClass('add-background-color');
          $(this).addClass('kapali-mobil-menu');
          $('body').css('overflow', '');        // scroll engeli kaldir

      }

  });


  /*BOOKING FORM ACMA */
  $('.book-session-button,.book-session-mobile-button').click(function (e) {

      if ($('#booking-form-wrapper').hasClass('booking-form-animate')) {
          $('#booking-form-wrapper').removeClass('booking-form-animate');
          $('body').css('overflow', '');        // scroll engeli kaldir
      } else {
          $('#booking-form-wrapper').css('display', 'block');
          $('#booking-form-wrapper').addClass('booking-form-animate');
          $('body').css('overflow', 'hidden');  // scroll engelle
      }

      e.preventDefault();

  });

  /*BOOKING FORM KAPATMA */
  $('.booking-form-closed').click(function (e) {

      if ($('#booking-form-wrapper').hasClass('booking-form-animate')) {
          $('#booking-form-wrapper').removeClass('booking-form-animate');
          $('body').css('overflow', '');        // scroll engeli kaldir
          $('#booking-form-wrapper').css('display', '')
      } else {
          $('#booking-form-wrapper').css('display', 'block');
          $('#booking-form-wrapper').addClass('booking-form-animate');
          $('body').css('overflow', 'hidden');  // scroll engelle
      }

      e.preventDefault();

  });




  /*ACCORDION KODU **************************************************************************/
  function close_accordion_section() {
      $('.accordion .accordion-section-title').removeClass('active');
      $('.accordion .accordion-section-content').slideUp(300).removeClass('open');
  }
  $('.accordion-section-title').click(function (e) {
      // Grab current anchor value
      var currentAttrValue = $(this).attr('href');

      if ($(e.target).is('.active')) {
          close_accordion_section();
      } else {
          close_accordion_section();

          // Add active class to section title
          $(this).addClass('active');
          // Open up the hidden content panel
          $('.accordion ' + currentAttrValue).slideDown(300).addClass('open');
      }
      e.preventDefault();
  });


});// document ready bitti

$('.fancybox').fancybox();