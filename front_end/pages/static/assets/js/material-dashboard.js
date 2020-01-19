/*!

 =========================================================
 * Material Dashboard - v2.1.1
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard
 * Copyright 2018 Creative Tim (http://www.creative-tim.com)

 * Designed by www.invisionapp.com Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */

//var lst = [];

/*jQuery.get("#", function(data){
        
  $.each(data, function(key, value){
lst.push(value)	;    
//console.log("x: " + value[0] + "; y:" + value[1]);
});
}*/

(function() {
  isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

  if (isWindows) {
    // if we are on windows OS we activate the perfectScrollbar function
    $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

    $('html').addClass('perfect-scrollbar-on');
  } else {
    $('html').addClass('perfect-scrollbar-off');
  }
})();


var breakCards = true;

var searchVisible = 0;
var transparent = true;

var transparentDemo = true;
var fixedTop = false;

var mobile_menu_visible = 0,
  mobile_menu_initialized = false,
  toggle_initialized = false,
  bootstrap_nav_initialized = false;

var seq = 0,
  delays = 80,
  durations = 500;
var seq2 = 0,
  delays2 = 80,
  durations2 = 500;

$(document).ready(function() {

  $('body').bootstrapMaterialDesign();

  $sidebar = $('.sidebar');

  md.initSidebarsCheck();

  window_width = $(window).width();

  // check if there is an image set for the sidebar's background
  md.checkSidebarImage();

  //    Activate bootstrap-select
  if ($(".selectpicker").length != 0) {
    $(".selectpicker").selectpicker();
  }

  //  Activate the tooltips
  $('[rel="tooltip"]').tooltip();

  $('.form-control').on("focus", function() {
    $(this).parent('.input-group').addClass("input-group-focus");
  }).on("blur", function() {
    $(this).parent(".input-group").removeClass("input-group-focus");
  });

  // remove class has-error for checkbox validation
  $('input[type="checkbox"][required="true"], input[type="radio"][required="true"]').on('click', function() {
    if ($(this).hasClass('error')) {
      $(this).closest('div').removeClass('has-error');
    }
  });

});

$(document).on('click', '.navbar-toggler', function() {
  $toggle = $(this);

  if (mobile_menu_visible == 1) {
    $('html').removeClass('nav-open');

    $('.close-layer').remove();
    setTimeout(function() {
      $toggle.removeClass('toggled');
    }, 400);

    mobile_menu_visible = 0;
  } else {
    setTimeout(function() {
      $toggle.addClass('toggled');
    }, 430);

    var $layer = $('<div class="close-layer"></div>');

    if ($('body').find('.main-panel').length != 0) {
      $layer.appendTo(".main-panel");

    } else if (($('body').hasClass('off-canvas-sidebar'))) {
      $layer.appendTo(".wrapper-full-page");
    }

    setTimeout(function() {
      $layer.addClass('visible');
    }, 100);

    $layer.click(function() {
      $('html').removeClass('nav-open');
      mobile_menu_visible = 0;

      $layer.removeClass('visible');

      setTimeout(function() {
        $layer.remove();
        $toggle.removeClass('toggled');

      }, 400);
    });

    $('html').addClass('nav-open');
    mobile_menu_visible = 1;

  }

});

// activate collapse right menu when the windows is resized
$(window).resize(function() {
  md.initSidebarsCheck();

  // reset the seq for charts drawing animations
  seq = seq2 = 0;

  setTimeout(function() {
    md.initDashboardPageCharts();
  }, 500);
});

md = {
  misc: {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
  },

  checkSidebarImage: function() {
    $sidebar = $('.sidebar');
    image_src = $sidebar.data('image');

    if (image_src !== undefined) {
      sidebar_container = '<div class="sidebar-background" style="background-image: url(' + image_src + ') "/>';
      $sidebar.append(sidebar_container);
    }
  },

  showNotification: function(from, align) {
    type = ['', 'info', 'danger', 'success', 'warning', 'rose', 'primary'];

    color = Math.floor((Math.random() * 6) + 1);

    $.notify({
      icon: "add_alert",
      message: "Welcome to <b>Material Dashboard Pro</b> - a beautiful admin panel for every web developer."

    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  },

  initDocumentationCharts: function() {
    if ($('#student1').length != 0 && $('#websiteViewsChart').length != 0) {
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

      datastudent1 = {
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        series: [
          [12, 17, 7, 17, 23, 18, 38]
        ]
      };

      optionsstudent = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: 4, // set the high sa the biggest value + something for a better look
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
      }

      var student1 = new Chartist.Line('#student1', datastudent1, optionsstudent);

      var animationHeaderChart = new Chartist.Line('#websiteViewsChart', datastudent1, optionsstudent);
    }
  },


  initFormExtendedDatetimepickers: function() {
    $('.datetimepicker').datetimepicker({
      icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-remove'
      }
    });

    $('.datepicker').datetimepicker({
      format: 'MM/DD/YYYY',
      icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-remove'
      }
    });

    $('.timepicker').datetimepicker({
      //          format: 'H:mm',    // use this format if you want the 24hours timepicker
      format: 'h:mm A', //use this format if you want the 12hours timpiecker with AM/PM toggle
      icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-remove'

      }
    });
  },


  initSliders: function() {
    // Sliders for demo purpose
    var slider = document.getElementById('sliderRegular');

    noUiSlider.create(slider, {
      start: 40,
      connect: [true, false],
      range: {
        min: 0,
        max: 100
      }
    });

    var slider2 = document.getElementById('sliderDouble');

    noUiSlider.create(slider2, {
      start: [20, 60],
      connect: true,
      range: {
        min: 0,
        max: 100
      }
    });
  },

  initSidebarsCheck: function() {
    if ($(window).width() <= 991) {
      if ($sidebar.length != 0) {
        md.initRightMenu();
      }
    }
  },

  checkFullPageBackgroundImage: function() {
    $page = $('.full-page');
    image_src = $page.data('image');

    if (image_src !== undefined) {
      image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
      $page.append(image_container);
    }
  },

  initDashboardPageCharts: function() {
    var lst = [3, 2, 1, 0, 2, 3, 3, 3, 2, 1];

    if ($('#student1').length != 0 || $('#completedTasksChart').length != 0 || $('#websiteViewsChart').length != 0) {
      /* ----------==========    Individual Students Attention Plotting Chart initialization    ==========---------- */
//initial data for student charts 
var s1 = [0,0,0,0,0,0,0]
      datastudent1 = {
        labels: [],
        series: [
        s1
      ]
      };
      var s2 = [0,0,0,0,0,0,0]
      datastudent2 = {
        labels: [],
        series: [
            s2
        ]
      };
      var s3 = [0,0,0,0,0,0,0]
      datastudent3 = {
        labels: [],
        series: [
            s3
        ]
      };
      var s4 = [0,0,0,0,0,0,0]
      datastudent4 = {
        labels: [],
        series: [
            s4
        ]
      };
      var s5 = [0,0,0,0,0,0,0]
      datastudent5 = {
        labels: [],
        series: [
            s5
        ]
      };
      var s6 = [0,0,0,0,0,0,0]
      datastudent6 = {
        labels: [],
        series: [
            s6
        ]
      };
      var s7 = [0,0,0,0,0,0,0]
      datastudent7 = {
        labels: [],
        series: [
            s7
        ]
      };
      var s8 = [0,0,0,0,0,0,0]
      datastudent8 = {
        labels: [],
        series: [
            s8
        ]
      };
      var s9 = [0,0,0,0,0,0,0]
      datastudent9 = {
        labels: [],
        series: [
          s9
        ]
      };
      var s10 = [0,0,0,0,0,0,0]
      datastudent10 = {
        labels: [],
        series: [
            s10
        ]
      };

//some styling for stud charts
      optionsstudent = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: 4, //set the high sa the biggest value + something for a better look
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
      }
      

      var student1 = new Chartist.Line('#student1', datastudent1, optionsstudent);
      var student2 = new Chartist.Line('#student2', datastudent1, optionsstudent);
      var student3 = new Chartist.Line('#student3', datastudent1, optionsstudent);
      var student4 = new Chartist.Line('#student4', datastudent1, optionsstudent);
      var student5 = new Chartist.Line('#student5', datastudent1, optionsstudent);
      var student6 = new Chartist.Line('#student6', datastudent1, optionsstudent);
      var student7 = new Chartist.Line('#student7', datastudent1, optionsstudent);
      var student8 = new Chartist.Line('#student8', datastudent1, optionsstudent);
      var student9 = new Chartist.Line('#student9', datastudent1, optionsstudent);
      var student10 = new Chartist.Line('#student10', datastudent1, optionsstudent);

      

//Update charts! part 1 of 2
setInterval(function(){
  s1.shift();
  s1.push(lst[0]);
  student1.update({
    labels: [],
        series: [
        s1
      ]
  });
  s2.shift();
  s2.push(lst[1]);
  student2.update({
    labels: [],
        series: [
s2        ]
  });
  s3.shift();
  s3.push(lst[2]);
  student3.update({
    labels: [],
        series: [
s3        ]
  });
  s4.shift();
  s4.push(lst[3]);
  student4.update({
    labels: [],
        series: [
s4        ]
  });
  s5.shift();
  s5.push(lst[4]);
  student5.update({
    labels: [],
        series: [
s5        ]
  });
}, 5500);

//Update charts! part 2 of 2
  setInterval(function(){
  s6.shift();
  s6.push(lst[5]);
  student6.update({
    labels: [],
        series: [
s6        ]
  });
  s7.shift();
  s7.push(lst[6]);
  student7.update({
    labels: [],
        series: [
s7        ]
  });
  s8.shift();
  s8.push(lst[7]);
  student8.update({
    labels: [],
        series: [
s8        ]
  });
  s9.shift();
  s9.push(lst[8]);
  student9.update({
    labels: [],
        series: [
s9        ]
  });
  s10.shift();
  s10.push(lst[9]);
  student10.update({
    labels: [],
        series: [
s10        ]
  });
}, 5500);

/* ----------==========     Completed Tasks Chart initialization    ==========---------- */

var avg = [];
var a = 0;
for (var i = 0; i < s1.length; i++){
    a = (s1[i] + s2[i] + s3[i] + s4[i] + s5[i] + s6[i] + s7[i] + s8[i] + s9[i] + s10[i])/10;
    avg.push(a);
} 

dataCompletedTasksChart = {
  labels: [],
  series: [
avg  ]
};

optionsCompletedTasksChart = {
  lineSmooth: Chartist.Interpolation.cardinal({
    tension: 0
  }),
  low: 0,
  high: 4, // set the high sa the biggest value + something for a better look
  chartPadding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
}

var sr = [1.50, 2.50, 3, 2.80, 2.40, 2, 1.90, 1];

setInterval(function() {
  //md.startAnimationForBarChart(websiteViewsChart);
  console.log("update pls");
  f = sr[0]; 
  for (var i = 0; i < sr.length; i++){
    
    if(i == sr.length-1){
      sr[i] = f;
    }
    else{
    sr[i] = sr[i+1];}
  }       
  completedTasksChart.update({
    labels: [],
    series: [
sr    ]
  });
  
}, 5000);

var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

// start animation for the Completed Tasks Chart - Line Chart
md.startAnimationForLineChart(completedTasksChart);


      /* ----------==========     Everyone's attention aka THE CHART    ==========---------- */

      var dataWebsiteViewsChart = {
        labels: ['Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5', 'Student 6', 'Student 7', 'Student 8', 'Student 9', 'Student 10'],
        series: [
          [542, 443, 320, 780, 553, 453, 326, 434, 568, 610]

        ]
      };

      var optionsWebsiteViewsChart = {
        axisX: {
          showGrid: false
        },
        low: 0,
        high: 4,
        chartPadding: {
          top: 0,
          right: 5,
          bottom: 0,
          left: 0
        }
      };
      var responsiveOptions = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function(value) {
              return value[0];
            }
          }
        }]
      ];
      var websiteViewsChart = Chartist.Bar('#websiteViewsChart', dataWebsiteViewsChart, optionsWebsiteViewsChart, responsiveOptions);

      setInterval(function() {
        //md.startAnimationForBarChart(websiteViewsChart);
        f = lst[0]; 
  for (var i = 0; i < lst.length; i++){
    
    if(i == lst.length-1){
      lst[i] = f;
    }
    else{
    lst[i] = lst[i+1];}
  }  
        console.log("update pls");        
        websiteViewsChart.update({
          labels: ['Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5', 'Student 6', 'Student 7', 'Student 8', 'Student 9', 'Student 10'],
          series: [
                    lst  
          ]
        });
        
      }, 5000);


      //start animation for the Emails Subscription Chart
            md.startAnimationForBarChart(websiteViewsChart);

    }
  },

  initMinimizeSidebar: function() {

    $('#minimizeSidebar').click(function() {
      var $btn = $(this);

      if (md.misc.sidebar_mini_active == true) {
        $('body').removeClass('sidebar-mini');
        md.misc.sidebar_mini_active = false;
      } else {
        $('body').addClass('sidebar-mini');
        md.misc.sidebar_mini_active = true;
      }

      // we simulate the window Resize so the charts will get updated in realtime.
      var simulateWindowResize = setInterval(function() {
        window.dispatchEvent(new Event('resize'));
      }, 180);

      // we stop the simulation of Window Resize after the animations are completed
      setTimeout(function() {
        clearInterval(simulateWindowResize);
      }, 1000);
    });
  },

  checkScrollForTransparentNavbar: debounce(function() {
    if ($(document).scrollTop() > 260) {
      if (transparent) {
        transparent = false;
        $('.navbar-color-on-scroll').removeClass('navbar-transparent');
      }
    } else {
      if (!transparent) {
        transparent = true;
        $('.navbar-color-on-scroll').addClass('navbar-transparent');
      }
    }
  }, 17),


  initRightMenu: debounce(function() {
    $sidebar_wrapper = $('.sidebar-wrapper');

    if (!mobile_menu_initialized) {
      $navbar = $('nav').find('.navbar-collapse').children('.navbar-nav');

      mobile_menu_content = '';

      nav_content = $navbar.html();

      nav_content = '<ul class="nav navbar-nav nav-mobile-menu">' + nav_content + '</ul>';

      navbar_form = $('nav').find('.navbar-form').get(0).outerHTML;

      $sidebar_nav = $sidebar_wrapper.find(' > .nav');

      // insert the navbar form before the sidebar list
      $nav_content = $(nav_content);
      $navbar_form = $(navbar_form);
      $nav_content.insertBefore($sidebar_nav);
      $navbar_form.insertBefore($nav_content);

      $(".sidebar-wrapper .dropdown .dropdown-menu > li > a").click(function(event) {
        event.stopPropagation();

      });

      // simulate resize so all the charts/maps will be redrawn
      window.dispatchEvent(new Event('resize'));

      mobile_menu_initialized = true;
    } else {
      if ($(window).width() > 991) {
        // reset all the additions that we made for the sidebar wrapper only if the screen is bigger than 991px
        $sidebar_wrapper.find('.navbar-form').remove();
        $sidebar_wrapper.find('.nav-mobile-menu').remove();

        mobile_menu_initialized = false;
      }
    }
  }, 200),

  startAnimationForLineChart: function(chart) {

    chart.on('draw', function(data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  },
  startAnimationForBarChart: function(chart) {

    chart.on('draw', function(data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  },


  initFullCalendar: function() {
    $calendar = $('#fullCalendar');

    today = new Date();
    y = today.getFullYear();
    m = today.getMonth();
    d = today.getDate();

    $calendar.fullCalendar({
      viewRender: function(view, element) {
        // We make sure that we activate the perfect scrollbar when the view isn't on Month
        if (view.name != 'month') {
          $(element).find('.fc-scroller').perfectScrollbar();
        }
      },
      header: {
        left: 'title',
        center: 'month,agendaWeek,agendaDay',
        right: 'prev,next,today'
      },
      defaultDate: today,
      selectable: true,
      selectHelper: true,
      views: {
        month: { // name of view
          titleFormat: 'MMMM YYYY'
          // other view-specific options here
        },
        week: {
          titleFormat: " MMMM D YYYY"
        },
        day: {
          titleFormat: 'D MMM, YYYY'
        }
      },

      select: function(start, end) {

        // on select we show the Sweet Alert modal with an input
        swal({
            title: 'Create an Event',
            html: '<div class="form-group">' +
              '<input class="form-control" placeholder="Event Title" id="input-field">' +
              '</div>',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
          }).then(function(result) {

            var eventData;
            event_title = $('#input-field').val();

            if (event_title) {
              eventData = {
                title: event_title,
                start: start,
                end: end
              };
              $calendar.fullCalendar('renderEvent', eventData, true); // stick? = true
            }

            $calendar.fullCalendar('unselect');

          })
          .catch(swal.noop);
      },
      editable: true,
      eventLimit: true, // allow "more" link when too many events


      // color classes: [ event-blue | event-azure | event-green | event-orange | event-red ]
      events: [{
          title: 'All Day Event',
          start: new Date(y, m, 1),
          className: 'event-default'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: new Date(y, m, d - 4, 6, 0),
          allDay: false,
          className: 'event-rose'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: new Date(y, m, d + 3, 6, 0),
          allDay: false,
          className: 'event-rose'
        },
        {
          title: 'Meeting',
          start: new Date(y, m, d - 1, 10, 30),
          allDay: false,
          className: 'event-green'
        },
        {
          title: 'Lunch',
          start: new Date(y, m, d + 7, 12, 0),
          end: new Date(y, m, d + 7, 14, 0),
          allDay: false,
          className: 'event-red'
        },
        {
          title: 'Md-pro Launch',
          start: new Date(y, m, d - 2, 12, 0),
          allDay: true,
          className: 'event-azure'
        },
        {
          title: 'Birthday Party',
          start: new Date(y, m, d + 1, 19, 0),
          end: new Date(y, m, d + 1, 22, 30),
          allDay: false,
          className: 'event-azure'
        },
        {
          title: 'Click for Creative Tim',
          start: new Date(y, m, 21),
          end: new Date(y, m, 22),
          url: 'http://www.creative-tim.com/',
          className: 'event-orange'
        },
        {
          title: 'Click for Google',
          start: new Date(y, m, 21),
          end: new Date(y, m, 22),
          url: 'http://www.creative-tim.com/',
          className: 'event-orange'
        }
      ]
    });
  },

  initVectorMap: function() {
    var mapData = {
      "AU": 760,
      "BR": 550,
      "CA": 120,
      "DE": 1300,
      "FR": 540,
      "GB": 690,
      "GE": 200,
      "IN": 200,
      "RO": 600,
      "RU": 300,
      "US": 2920,
    };

    $('#worldMap').vectorMap({
      map: 'world_mill_en',
      backgroundColor: "transparent",
      zoomOnScroll: false,
      regionStyle: {
        initial: {
          fill: '#e4e4e4',
          "fill-opacity": 0.9,
          stroke: 'none',
          "stroke-width": 0,
          "stroke-opacity": 0
        }
      },

      series: {
        regions: [{
          values: mapData,
          scale: ["#AAAAAA", "#444444"],
          normalizeFunction: 'polynomial'
        }]
      },
    });
  }
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};