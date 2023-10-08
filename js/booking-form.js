var selectedLocation = {
  airport: {
    name: "",
    code: "",
    locationId: ""
  },
  area: {
    name:"",
    areaId:"",
  },
  room: {
    roomCategoryId:"",
    name:"",
    capacity: 0,
    price: 0,
    rawPrice: 0,
    discountRate: 0,
    vateRate: 0,
    accommodationRate: 0,
    currencyCode: "",
    currencyId: ""
  }
}



var airport = {
  fetchAirpots() {
    $.ajax({
      type: "GET",
      url: "http://kepler.marrul.com/api/KeplerService/Get?id=1",
      crossDomain: true,
      success: function(response) {

        // Set airports
        var $airports = $('#airports');
        
        response.map(function(item) {
          $airports.append('<option value="'+ item.locationId +'">'+ item.name +'</option>');
          selectedLocation.airport.name = item.name;
          selectedLocation.airport.locationId = item.locationId;
          selectedLocation.airport.code = item.code;
        });

        // Set areas and rooms on change
        $airports.on('change', function() {

          var airportIndex = $airports.find('option:selected').index() - 1;

          // Set areas
          var $areas = $('#areas');
          $areas.val('').trigger('change');
          $areas.find('option').not(':first-child').remove();

          if ( airportIndex !== -1 ) {
            response[airportIndex].areas.map(function(item) {
              $areas.append('<option value="'+ item.areaId +'">'+ item.name +'</option>');
              selectedLocation.area.name = item.name;
              selectedLocation.area.areaId = item.areaId;

            });
          }

          // Set rooms
          var $rooms = $('#rooms');
          $rooms.val('').trigger('change');
          $rooms.find('option').not(':first-child').remove();

          if ( airportIndex !== -1 ) {
            response[airportIndex].roomInfoList.map(function(item) {
              $rooms.append('<option value="'+ item.roomCategoryId +'">'+ item.name +'</option>');

              selectedLocation.room.roomCategoryId = item.roomCategoryId;
              selectedLocation.room.name = item.name;
              selectedLocation.room.capacity = item.capacity
              selectedLocation.room.price = item.price
              selectedLocation.room.rawPrice = item.rawPrice
              selectedLocation.room.discountRate = item.discountRate
              selectedLocation.room.vateRate = item.vateRate
              selectedLocation.room.accommodationRate = item.accommodationRate
              selectedLocation.room.currencyCode = item.currencyCode
              selectedLocation.room.currencyId = item.currencyId
            });
            

          }


        });

      },
      dataType: "json",
      timeout: 30000,
      error: function() {
        if (typeof callback !== "undefined")
          callback({
            type: "error",
          });
      },
    });
  },
};

airport.fetchAirpots();

var bookingEvents = {

  /*CVC alanindaki ? iconuna basinca tooltip acilmasini saglayan kod */
  cvcToolTip() {
    $(".cvc-mark").bind("click", function() {
      $(".cvc-info-tooltip").toggleClass("ems-none");
    });

    $(".cvc-info-close").bind("click", function() {
      $(".cvc-info-tooltip").addClass("ems-none");
    });

    $("#cvc").bind("focus", function() {
      $(".cvc-info-tooltip").addClass("ems-none");
    });
  },
  /*TERM OF USE BILDIRIM ALANINI ACIP KAPATAN SCRIPT */
  birthDateWarning() {
    var isOpen = false;
    var maxDate = setDate(-7, 0, 0);
    var currentMaxDate = maxDate.substr(0, 4);
    var _yearRange = "1900:" + currentMaxDate;

    // $(".hasDatepicker").on("click", function() {
    $("#birthdate").on("focus", function() {
      if (!isOpen) {
        $(".child-warning").removeClass(cls.none);
        $(".warning-background").removeClass(cls.none);
        isOpen = true;
      }
      //Alttaki satir neden datepicker acmiyor sorulacak
      else {
        $("#birthdate").datepicker({
          yearRange: _yearRange,
          maxDate: "-7y",
          changeMonth: true,
          changeYear: true,
          dateFormat: "yy-mm-dd",
          showButtonPanel: true,
        });
      }
    });

    $(".child-warning").bind("click", function() {
        $(".child-warning").addClass(cls.none);
        $(".warning-background").addClass(cls.none);
      });
  },
  privacyPolicyAndTermOfUseWarning() {
    // Privacy Policy Açar
    $(".pd-privacy").bind("click", function() {
      $(".pp-warning").removeClass(cls.none);
      $(".warning-background").removeClass(cls.none);
    });
    // Privacy Policy Kapatır
    $(".pp-warning")
      .find(".form-close-button")
      .bind("click", function() {
        $(".pp-warning").addClass(cls.none);
        $(".warning-background").addClass(cls.none);
      });
    // Terms of Use Açar
    $(".pd-term").bind("click", function() {
      $(".tou-warning").removeClass(cls.none);
      $(".warning-background").removeClass(cls.none);
    });
    // terms of Use Kapatır
    $(".tou-warning")
      .find(".form-close-button")
      .bind("click", function() {
        $(".tou-warning").addClass(cls.none);
        $(".warning-background").addClass(cls.none);
      });
  },
  timePickerWarnings() {
    if (date.checkIn.time != "" && date.checkOut.time != "" && date.selectedHours.length != 0) {
      $(".time-picker-warnings").removeClass(cls.none);

      if (!!date.totalHours && date.totalHours != NaN) {
        $("#tp-totalHour").text(date.totalHours);
        $("#ci-day").text(
          $("#db-in-date")
            .val()
            .substring(0, 6)
        );
        $("#co-day").text(
          $("#db-out-date")
            .val()
            .substring(0, 6)
        );
      }
      // Aynı gun degıl ise zaman uayarısını açar
      if (date.checkOut.day !== date.checkIn.day && date.selectedHours.length != 0) {
        $(".date-warning").removeClass(cls.none);
      }
    }
  },
  init() {
    this.birthDateWarning();
    this.cvcToolTip();
    this.privacyPolicyAndTermOfUseWarning();
  },
}

setTimeout(function() {
  bookingEvents.init();
}, 10);







/*KREDI KARTI GORUNTUSU generate eden ve CVC alanına gelince kartı çeviren script */
var creditCard = new Card({
  form: document.querySelector("#credit-card-form"),
  container: ".card-wrapper",
  formSelectors: {
    numberInput: 'input#card-number', // optional — default input[name="number"]
    expiryInput: 'input#expiration', // optional — default input[name="expiry"]
    cvcInput: 'input#cvc', // optional — default input[name="cvc"]
    nameInput: 'input#card-holder' // optional - defaults input[name="name"]
  },
  width: 320, // optional — default 350px
  messages: {
    validDate: 'valid\ndate', // optional - default 'valid\nthru'
    monthYear: 'mm/yy', // optional - default 'month/year'
  },
});



/*BOOKING FORM (Choose Location, Choose Area ve Room Category) alanlarının dropdownlarının kontrol eden script  */

const selectedDrowDowns = document.querySelectorAll(".wrapper-dropdown");

selectedDrowDowns.forEach((selected) => {
  const optionsContainer = selected.children[2];
  const optionsList = selected.querySelectorAll("div.wrapper-dropdown li");

  selected.addEventListener("click", () => {


    if (selected.classList.contains("active")) {
      handleDropdown(selected, false);
    } else {
      let currentActive = document.querySelector(".wrapper-dropdown.active");

      if (currentActive) {
        handleDropdown(currentActive, false);
      }

      handleDropdown(selected, true);
    }
  });

  // update the display of the dropdown
  for (let o of optionsList) {
    o.addEventListener("click", () => {
      selected.querySelector(".selected-display").innerHTML = o.innerHTML;
    });
  }
});

// check if anything else ofther than the dropdown is clicked
window.addEventListener("click", function (e) {
  if (e.target.closest(".wrapper-dropdown") === null) {
    closeAllDropdowns();
  }
});

// close all the dropdowns
function closeAllDropdowns() {
  const selectedDrowDowns = document.querySelectorAll(".wrapper-dropdown");
  selectedDrowDowns.forEach((selected) => {
    handleDropdown(selected, false);
  });
}

// open all the dropdowns
function handleDropdown(dropdown,  open) {
  if (open) {
    dropdown.classList.add("active");
  } else {
    dropdown.classList.remove("active");
  }
}



var cls = {
  none: "ems-none",
  selectedItem: "selected-item",
  selectedButton: "selected-button",
  selectedText: "selected-text",
  selectedTime: "selected-time",
  bookedTime: "booked-time",
  active: "active",
  disabled: "disabled",
  notAvailable: "not-available",
  notEnoughCapacity: "not-enough-capacity",
  isLoading: "isLoading",
};

var product = {
  elements: {
    guest: ".guest-container",
    counter: {
      container: ".counter-container",
      wrapper: ".counter-wrapper",
      button: ".button-counter",
      title: ".button-title",
    },
  },
  male: 0,
  female: 0,

  setProductAmount(el) {
    var input = $(el).find("input");
    var nextStep = false;

    $(el)
      .find(this.elements.counter.button)
      .bind("click", function() {
        var value = parseInt(input.val());

        var type = $(this).attr("rel");
        var target = $(input.attr("data-target"));
        var max = input.attr("max");

        value = type === "inc" ? (value = value + 1) : (value = value - 1);
        value < 0 ? (value = 0) : input.val(value);
        if (value >= max) {
          value = max;
     
        } else {
          input.val(value);
          $(el)
            .find(product.elements.counter.button)
        }
        target.length > 0 ? target.text(value) : 0;

        product.male = $("#male").val();
        product.female = $("#female").val();

        $(el)
          .siblings()

        // Ilgili counter'in title'ina class atar
        $(el)
          .siblings()
          .find(product.elements.counter.title)
        $(el)
          .find(product.elements.counter.title)

        // $(".guest-family-info").addClass(cls.none);

        if (!nextStep) {
          nextStep = true;
          var parent = $(el)
            .parent()
            .parent();
          parent
            .next()
            .find(".input-info")
          parent
            .next()

          parent
            .next()
            .find("ul")
        }
      });
  },
};

$(product.elements.counter.container)
  .find(product.elements.counter.wrapper)
  .each(function() {
    product.setProductAmount(this);
});

function logTimes(date) {}

function setDate(addYear, addMonth, addDay) {
  var currentDate = new Date();
  addDay === undefined ? (addDay = 0) : addDay;
  addMonth === undefined ? (addMonth = 0) : addMonth;
  addYear === undefined ? (addYear = 0) : addYear;
  return (
    (currentDate.getFullYear() + addYear).toString() + "-" + (currentDate.getMonth() + 1 + addMonth).toString().padStart(2, 0) + "-" + (currentDate.getDate() + addDay).toString().padStart(2, 0)
  );
}


var date = {
  // Elements

  elements: {
    datePicker: {
      ready: "datepicker-ready",
      container: ".date-picker-container",
      checkIn: {
        db: "#db-in-date",
        el: "#in-date",
      },
      checkOut: {
        db: "#db-out-date",
        el: "#out-date",
      },
    },
    calendar: {
      container: ".calendar-container",
      title: ".calendar-button",
      button: ".date-counter-button",
      checkIn: ".check-in-info",
      checkOut: ".check-out-info",
    },
    timePicker: {
      container: ".time-container",
      hours: ".time-container li",
      info: ".time-info",
      warning: ".time-picker-warnings",
    },
  },

  // Model
  temp: "",
  checkIn: {
    day: "",
    time: "",
    active: true,
  },
  checkOut: {
    day: "",
    time: "",
    active: false,
  },
  selectedHours: [],
  unavailableHours: [],
  disabledBeforeCurrent: [],
  // Methods

  get fullCheckIn() {
    return this.checkIn.day + " " + this.checkIn.time;
  },

  get fullCheckOut() {
    return this.checkOut.day + " " + this.checkOut.time;
  },

  get totalHours() {
    if (this.checkIn.day == this.checkOut.day) {
      return parseInt(this.checkOut.time) - parseInt(this.checkIn.time);
    } else {
      return 24 - parseInt(this.checkIn.time) + parseInt(this.checkOut.time);
    }
  },

  set setText(element) {
    return $(date.elements.calendar.title).text(
      $(element)
        .val()
        .toString()
    );
  },

  set setDateAttribute(element) {
    return $(date.elements.timePicker.hours).attr("data-date", $(element).val());
  },

  // Calculate Selected Hours

  setSelectedHours() {
    var checkInHour, checkOutHour, fullHour;
    date.selectedHours = [];
    checkInHour = 0;
    checkOutHour = 0;
    fullHour = 0;

    var isFirstDayFailed = false;

    // If Check in and out day is same

    if (date.checkIn.day == date.checkOut.day) {
      while (fullHour <= date.totalHours) {
        var addedHour = date.checkIn.day + " " + String(parseInt(date.checkIn.time) + fullHour).padStart(2, 0) + ":00";
        if (date.unavailableHours.indexOf(addedHour) == -1) {
          date.selectedHours.push(addedHour);
          fullHour++;
        } else {
          date.selectedHours = [];
          fullHour = 0;

          date.checkOut.time = "";
          date.checkOut.day = "";

          $(date.elements.datePicker.checkOut.el).datepicker("setDate", date.temp);
          $(date.elements.datePicker.checkOut.el).datepicker("option", "minDate", date.checkIn.day);
          date.checkIn.active = false;
          date.checkOut.active = true;
          date.checkOutUI();
          break;
        }
      }
      // If Check in and out day is NOT same
    } else if (new Date(date.checkIn.day).valueOf() < new Date(date.checkOut.day).valueOf()) {
      while (checkInHour < 24 - parseInt(date.checkIn.time)) {
        var addedHourCheckIn = date.checkIn.day + " " + String(parseInt(date.checkIn.time) + checkInHour).padStart(2, 0) + ":00";
        if (date.unavailableHours.indexOf(addedHourCheckIn) == -1) {
          date.selectedHours.push(addedHourCheckIn);
          checkInHour++;
          isFirstDayFailed = false;
        } else {
          date.selectedHours = [];
          checkInHour = 0;
          isFirstDayFailed = true;

          date.checkOut.time = "";
          date.checkOut.day = "";
          $(date.elements.datePicker.checkOut.el).datepicker("setDate", date.temp);
          $(date.elements.datePicker.checkOut.el).datepicker("option", "minDate", date.checkIn.day);
          date.checkOutUI();

          break;
        }
      }
      if (!isFirstDayFailed) {
        while (checkOutHour <= parseInt(date.checkOut.time)) {
          var addedHourCheckOut = date.checkOut.day + " " + String(checkOutHour).padStart(2, 0) + ":00";
          if (date.unavailableHours.indexOf(addedHourCheckOut) == -1) {
            date.selectedHours.push(addedHourCheckOut);
            checkOutHour++;
          } else {
            date.selectedHours = [];
            checkOutHour = 0;
            break;
          }
        }
      }
    }
  },

  setDatePickerDate(element) {
    var date;
    try {
      date = $.datepicker.parseDate("yy-mm-dd", element.value);
    } catch (error) {
      date = null;
    }
    return date;
  },

  setDatePickerObject(type) {
    return $(type.el).datepicker({
      altFormat: "d M, y",
      dateFormat: "yy-mm-dd",
      altField: type.db,
      defaultDate: "+1d",
      changeMonth: false,
      numberOfMonths: 1,
      minDate: setDate(),
      showButtonPanel: true,
    });
  },

  setDateWithDatePicker() {
    var checkIn = date.elements.datePicker.checkIn;
    var checkOut = date.elements.datePicker.checkOut;

    var checkInDatepicker = date.setDatePickerObject(checkIn);
    var checkOutDatePicker = date.setDatePickerObject(checkOut);

    $(checkIn.el).datepicker("setDate", setDate());

    date.temp = $(checkIn.el).val();

    this.setText = checkIn.db;

    $(".check-in-info").bind("click", function() {
      $("body").addClass(date.elements.datePicker.ready);
      $("#in-date").datepicker("show");
      $(".check-out-info").removeClass(cls.active);
      $(".check-in-info").addClass(cls.active);
      date.checkIn.active = true;
      date.checkOut.active = false;
    });

    checkInDatepicker.on("change", function() {
      $("body").removeClass(date.elements.datePicker.ready);

      $(checkOut.el).datepicker("setDate", date.setDatePickerDate(this));
      $(checkOut.el).datepicker("option", "minDate", date.setDatePickerDate(this));

      // Maximum Date is one date after check-in date
      var maxDate = new Date(
        $(checkIn.el)
          .datepicker("getDate")
          .valueOf()
      );
      maxDate.setDate(maxDate.getDate() + 1);
      $(checkOut.el).datepicker("option", "maxDate", maxDate);
      // Shows Selected Date on Screen
      date.setText = checkIn.db;
      // Set Data Date Attribute on TimePicker Elements
      date.setDateAttribute = checkIn.el;
      // Set Check-in Day
      date.temp = $(checkIn.el).val();

      if (new Date(date.temp).valueOf() > new Date(date.checkOut.day).valueOf()) {
        date.checkOut.day = "";
        date.temp = $(checkIn.el).val();
      }
      date.checkIn.active = true;
      date.checkOut.active = false;
      date.checkTimes();

      logTimes(date);
    });

    $(checkOut.el).datepicker("setDate", setDate());

    date.temp = $(checkOut.el).val();

    $(".check-out-info").bind("click", function() {
      $("body").addClass(date.elements.datePicker.ready);
      var maxDate = new Date(
        $(checkIn.el)
          .datepicker("getDate")
          .valueOf()
      );
      maxDate.setDate(maxDate.getDate() + 1);
      $(checkOut.el).datepicker("option", "maxDate", maxDate);

      $("#out-date").datepicker("show");
      $(".check-out-info").addClass(cls.active);
      $(".check-in-info").removeClass(cls.active);

      date.checkIn.active = false;
      date.checkOut.active = true;
    });

    checkOutDatePicker.on("change", function() {
      $("body").removeClass(date.elements.datePicker.ready);
      // Shows Selected Date on Screen
      date.setText = checkOut.db;
      // Set Data Date Attribute on TimePicker Elements
      date.setDateAttribute = checkOut.el;
      // Set Check-in Day
      date.temp = $(checkOut.el).val();

      // if (new Date(date.temp).valueOf() > new Date(date.checkIn.day).valueOf()) {

      //   date.temp = $(checkIn.el).val();
      // }
      date.checkIn.active = false;
      date.checkOut.active = true;
      date.checkTimes();

      logTimes(date);
    });
  },

  dateCounter(picker, type) {
    var add = 0;
    $(picker.el).val(date.temp);
    var currentDate = $(picker.el).datepicker("getDate");

    // type === "date-inc" ? (add = 1) : (add = -1);

    if (date.checkIn.active) {
      type === "date-inc" ? (add = 1) : (add = -1);
    } else {
      if (new Date(date.temp).valueOf() > new Date(date.checkIn.day).valueOf()) {
        type === "date-inc" ? (add = 0) : (add = -1);
      } else {
        type === "date-inc" ? (add = 1) : (add = -1);
      }
    }

    currentDate.setDate(currentDate.getDate() + add);
    $(picker.el).datepicker("setDate", currentDate);
    date.temp = $(picker.el).val();
  },

  dateCounterController() {
    $(date.elements.calendar.container)
      .find(date.elements.calendar.button)
      .removeClass(cls.disabled);

    $(date.elements.calendar.button).each(function() {
      if ($(this).attr("rel") == "date-inc" && new Date(date.temp).valueOf() > new Date(date.checkIn.day).valueOf()) {
        $(this).addClass(cls.disabled);
      }

      if ($(this).attr("rel") == "date-dec" && date.temp == setDate()) {
        $(this).addClass(cls.disabled);
      }
    });
    if (!!date.checkIn.time && !!date.checkOut.time && date.temp != setDate()) {
      $(date.elements.calendar.container)
        .find(date.elements.calendar.button)
        .removeClass(cls.disabled);
    }
  },

  setDatewithButtons() {
    var checkIn = date.elements.datePicker.checkIn;
    var checkOut = date.elements.datePicker.checkOut;

    $(date.elements.calendar.button).bind("click", function() {
      var type = $(this).attr("rel");

      if (date.checkIn.active) {
        date.dateCounter(checkIn, type);
        date.setDateAttribute = checkIn.el;
        date.setText = checkIn.db;
      } else if (date.checkOut.active) {
        date.dateCounter(checkOut, type);
        date.setDateAttribute = checkOut.el;
        date.setText = checkOut.db;
      }
      date.dateCounterController();
      date.checkTimes();
      logTimes(date);
    });
  },

  set setSelectedTime(el) {
    // IS NULL
    if (date.checkIn.active) {
      date.checkIn.active = false;
      date.checkOut.active = true;

      date.checkOut.time = "";
      date.checkOut.day = "";

      date.checkIn.time = el.attr("data-time");
      date.checkIn.day = date.temp;

      $(date.elements.datePicker.checkIn.el).datepicker("setDate", date.temp);
      $(date.elements.datePicker.checkOut.el).datepicker("setDate", date.temp);

      $(".time-picker-warnings").addClass(cls.none);
      $(".date-warning").addClass(cls.none);

      date.checkInUI();

      logTimes(date);
    } else if (date.checkOut.active) {
      date.checkIn.active = true;
      date.checkOut.active = false;

      if (date.temp == date.checkIn.day) {
        // IS SELECTED EQUAL OR LESS THAN CHECK-IN
        if (parseInt(el.attr("data-time")) <= parseInt(date.checkIn.time)) {
          date.checkIn.time = el.attr("data-time");
          date.checkIn.active = false;
          date.checkOut.active = true;
          $(date.elements.datePicker.checkIn.el).datepicker("setDate", date.temp);
          $(date.elements.datePicker.checkOut.el).datepicker("setDate", date.temp);
          $(date.elements.datePicker.checkOut.el).datepicker("option", "minDate", date.checkIn.day);
          date.checkInUI();
          // IS SELECTED GREATER THAN CHECK-IN
        } else {
          date.checkOut.time = el.attr("data-time");
          date.checkOut.day = date.temp;
          $(date.elements.datePicker.checkOut.el).datepicker("setDate", date.temp);
          date.checkOutUI();
        }
      } else if (new Date(date.temp).valueOf() < new Date(date.checkIn.day).valueOf()) {
        date.checkIn.time = el.attr("data-time");
        date.checkIn.day = date.temp;
        date.checkIn.active = false;
        date.checkOut.active = true;
        $(date.elements.datePicker.checkIn.el).datepicker("setDate", date.temp);
        $(date.elements.datePicker.checkOut.el).datepicker("setDate", date.temp);
        $(date.elements.datePicker.checkOut.el).datepicker("option", "minDate", date.checkIn.day);
        date.checkInUI();
      } else if (new Date(date.temp).valueOf() > new Date(date.checkIn.day).valueOf()) {
        date.checkOut.time = el.attr("data-time");
        date.checkOut.day = date.temp;
        $(date.elements.datePicker.checkOut.el).datepicker("setDate", date.temp);
        date.checkOutUI();
      }
    }
  },

  checkInUI() {
    $(date.elements.datePicker.container)
      .find(".input-info " + date.elements.calendar.checkIn)
      .addClass("filled")
      .find(date.elements.timePicker.info)
      .text($(date.elements.datePicker.checkIn.db).val() + " - " + date.checkIn.time);

    // Checkout'u UI'da Siler
    $(date.elements.datePicker.container)
      .find(".input-info " + date.elements.calendar.checkOut)
      .removeClass("filled")
      .find(date.elements.timePicker.info)
      .text("");

    $(date.elements.datePicker.container)
      .find(".input-info " + date.elements.calendar.checkIn)
      .addClass(cls.active);

    $(date.elements.datePicker.container)
      .find(".input-info " + date.elements.calendar.checkOut)
      .removeClass(cls.active);
  },
  checkOutUI() {
    $(date.elements.datePicker.container)
      .find(".input-info " + date.elements.calendar.checkOut)
      .addClass(!date.checkOut.active ? "filled" : "")
      .find(date.elements.timePicker.info)
      .text(!date.checkOut.active ? $(date.elements.datePicker.checkOut.db).val() + " - " + date.checkOut.time : "");

    $(date.elements.datePicker.container)
      .find(".input-info " + date.elements.calendar.checkOut)
      .addClass(!date.checkOut.active ? cls.active : "");

    $(date.elements.datePicker.container)
      .find(".input-info " + date.elements.calendar.checkIn)
      .removeClass(!date.checkOut.active ? cls.active : "");
  },

  resetUnavailableHours(el) {
    el.removeClass(cls.notAvailable);
  },

  setUnavailableNextDay(el) {
    if (
      date.checkIn.time != "" &&
      parseInt(date.checkIn.time) < parseInt(date.unavailableHours[date.unavailableHours.length - 1].substring(11, 16)) &&
      new Date(date.temp).valueOf() > new Date(date.checkIn.day).valueOf()
    ) {
      el.addClass(cls.notAvailable);
    }
  },

  setUnavailableSameDay(el, time) {
    if (date.checkIn.time != "" && date.checkOut.time == "") {
      if (parseInt(date.checkIn.time) < parseInt(time.substring(11, 16))) {
        el.nextAll(".not-enough-capacity")
          .nextAll()
          .addClass(cls.notAvailable);
      }
    }
  },

  max24HourLimit(el, time) {
    var checkInDay = new Date(date.checkIn.day).valueOf();
    var tempDay = new Date(date.temp).valueOf();
    var oneDayInUNIX = 24 * 60 * 60 * 1000;

    if (checkInDay + oneDayInUNIX == tempDay && parseInt(time) > parseInt(date.checkIn.time)) {
      el.addClass(cls.disabled);
    }
  },

  resetIntersectedHours(el) {
    if (date.unavailableHours.length != 0 && (date.unavailableHours.indexOf(date.fullCheckIn) != -1 || date.unavailableHours.indexOf(date.fullCheckOut) != -1)) {
      date.checkIn.active = true;
      date.checkOut.active = false;

      date.checkIn.time = "";
      date.checkIn.day = "";

      date.checkOut.time = "";
      date.checkOut.day = "";

      date.selectedHours = [];
      date.totalHours = 0;

      $(date.elements.datePicker.checkIn.el).datepicker("setDate", date.temp);
      $(date.elements.datePicker.checkOut.el).datepicker("setDate", date.temp);

      $(".time-picker-warnings").addClass(cls.none);
      $(".date-warning").addClass(cls.none);

      el.removeClass(cls.selectedTime);
      el.removeClass(cls.bookedTime);

      date.checkInUI();
      date.checkOutUI();

      $(date.elements.datePicker.container)
        .find(".input-info " + date.elements.calendar.checkIn)
        .removeClass("filled")
        .find(date.elements.timePicker.info)
        .text("");

      $(date.elements.datePicker.container)
        .find(".input-info " + date.elements.calendar.checkOut)
        .removeClass("filled")
        .find(date.elements.timePicker.info)
        .text("");
    }
  },

  // setUnavailableBeforeCurrent(el) {
  //   $(date.elements.timePicker.hours).each(function() {
  //     var elDay = $(this).attr("data-date");
  //     var elTime = $(this).attr("data-time");

  //     if (elDay == setDate() && parseInt(elTime) <= new Date().getHours()) {
  //       $(this).addClass(cls.disabled);
  //       // date.disabledBeforeCurrent.push(setDate() + " " + elTime);
  //     }
  //     // var lastDate = setDate() + " 20:00";
  //     // var lastDate2 = setDate() + " 22:00";
  //     // date.unavailableHours.push(lastDate);
  //     // date.unavailableHours.push(lastDate2);
  //   });
  // },

  checkTimes() {
    $(date.elements.timePicker.hours).each(function() {
      $(this).removeClass(cls.selectedTime);
      $(this).removeClass(cls.bookedTime);
      $(this).removeClass(cls.disabled);
      //$(this).removeClass(cls.notAvailable);
      $(this).removeClass(cls.notEnoughCapacity);

      var elDay = $(this).attr("data-date");
      var elTime = $(this).attr("data-time");
      var elFullDate = elDay + " " + elTime;

      if (elDay == setDate() && parseInt(elTime) < new Date().getHours()) {
        $(this).addClass(cls.disabled);
      }
      if (elDay == setDate() && parseInt(elTime) == new Date().getHours() && new Date().getMinutes() > 40) {
        $(this).addClass(cls.disabled);
      }

      // ADD UI SELECTED HOURS
      if (elFullDate == date.checkIn.day + " " + date.checkIn.time || elFullDate == date.selectedHours[date.selectedHours.length - 1]) {
        $(this).addClass(cls.selectedTime);
      }

      // ADD UI BOOKED HOURS
      date.selectedHours.forEach(time => {
        if (elFullDate == time) {
          $(this).addClass(cls.bookedTime);
        }
      });

      date.resetIntersectedHours($(this));

      if (!!date.checkIn.time) date.max24HourLimit($(this), elTime);

      date.unavailableHours.forEach(time => {
        if (elFullDate == time) {
          $(this).addClass(cls.notEnoughCapacity);
        }
        // date.resetUnavailableHours($(this));

        if (date.selectedHours.length == 0) {
          date.resetUnavailableHours($(this));
        }

        date.setUnavailableNextDay($(this));
        date.setUnavailableSameDay($(this), time);

        if (date.checkIn.time != "" && date.checkOut.time != "") {
          date.resetUnavailableHours($(this));
        }
      });
    });
  },

  setTime() {
    // IS FIRST
    $(date.elements.timePicker.hours).bind("click", function() {
      date.setSelectedTime = $(this);
      date.setSelectedHours();
      date.checkTimes();
      date.dateCounterController();
      bookingEvents.timePickerWarnings();
      logTimes(date);
    });
  },
  init() {
    $(date.elements.timePicker.hours).attr("data-date", setDate());
    //this.setUnavailableBeforeCurrent();
    this.dateCounterController();
    this.setDateWithDatePicker();
    this.setDatewithButtons();
    this.setTime();
    this.checkTimes();
  },
};

date.init();

/* YOLCU BILGISI FORMU  - KONTROLLER VS - GUEST INFO ISLEMLERI */
  var guest = {
    // DOM
    elements: {
      container: ".guest-container",
      counter: {
        container: ".counter-container",
        wrapper: ".counter-wrapper",
        button: ".button-counter",
      },
    },
    // Inputs
    inputs: {
      name: {
        element: "#name",
        check: false,
        regex: /\w\D/,
      },
      surname: {
        element: "#surname",
        check: false,
        regex: /\w\D/,
      },
      gender: {
        element: "#gender",
        check: false,
      },
      email: {
        element: "#email",
        check: false,
        regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      },
      countryCode: {
        element: "#countryCode",
        check: true, // because of inital value
        regex: /^\+?(\d+)/,
      },
      mobile: {
        element: "#mobile",
        check: false,
        regex: /^[0-9]{9,13}$/,
      },
      birthdate: {
        element: "#birthdate",
        check: false,
      },
    },
    // Models
    passenger : {
      name: "",
      surname: "",
      gender: "",
      email:"",
      phoneNumber: "",
      birthDate: ""
    },
    skipGuestInfo() {
      // Kisinin forma doldurdugu verileri model'ime aktariyorum.
      var info = this.passenger;
      info.name = $(guest.inputs.name.element).val();
      info.surname = $(guest.inputs.surname.element).val();
      info.gender = $(guest.inputs.gender.element).val();
      info.email = $(guest.inputs.email.element).val();
      info.phoneNumber = $(guest.inputs.countryCode.element).val().substring(1) + $(guest.inputs.mobile.element).val();
      info.birthDate = $(guest.inputs.birthdate.element).val();
      
    },
    prepareReservation() {
      var data = null;
      $.ajax({
        type: "POST",
        url: "http://kepler.marrul.com/api/KeplerService/Get?id=1",
        data: "Rezervasyon =" + rezervasyonBilgileri.info + "GuestInfo=" + guest.passenger,
        crossDomain: true,
        success: function(resp) {
          if (!resp.isSuccess) {
            $("body").removeClass("isLoading");
            this.errorParser(resp.message);
            $(".post-sonuclari-warning .warning-content-wrapper").removeClass(cls.none);
            $(".warning-background").removeClass(cls.none);
          } else if (!!resp.data) {
            data = resp.data;
            //Burada kredi kartın sayfasına yönlendireceğiz. stepper
          }
        },
        complete: function() {
          if (!!data) {
            //ihtiyac olursa diye ekledim. Gereksizse silinebilir.
          }
  
        },  
        error: function(resp) {
          $("body").removeClass(cls.isLoading);
          $(".post-sonuclari-warning .warning-content-wrapper").find(".warning-title p").text(msg);
          $(".post-sonuclari-warning").removeClass(cls.none);
          $(".warning-background").removeClass(cls.none);
        },
      });
    },
    errorParser(msg) {
      $(".post-sonuclari-warning .warning-content-wrapper")
        .find(".warning-title p")
        .text(msg);
    },
    setValue(element) {
      return $(element).val();
    },
    get fullPhoneNumber() {
      return this.countryCode + this.phoneNumber;
    },
    get fullName() {
      return this.name + " " + this.surname;
    },

    formValidation() {
      var inputArrays = Object.values(this.inputs);
      inputArrays.forEach(function(input) {
        if (input.element == "#mobile") {
          $(input.element).on("input propertychange", function() {
            if (input.regex.test($(this).val())) {
              $(this)
                .parent()
                .parent()
                .addClass("form-valid")
                .removeClass("form-invalid");
              input.check = true;
            } else {
              $(this)
                .parent()
                .parent()
                .addClass("form-invalid")
                .removeClass("form-valid");
              input.check = false;
            }
          });
        } else if (input.element == "#birthdate") {
          $(input.element).on("change", function() {
            if ($(this).val() != "") {
              $(this)
                .parent()
                .addClass("form-valid")
                .removeClass("form-invalid");
              input.check = true;
            } else {
              $(this)
                .parent()
                .addClass("form-invalid")
                .removeClass("form-valid");
              input.check = false;
            }
          });
        } else if (input.element == "#gender") {
          $(input.element).on("change", function() {
            if ($(this).val() != "") {
              $(this)
                .parent()
                .addClass("form-valid")
                .removeClass("form-invalid");
              input.check = true;
            } else {
              $(this)
                .parent()
                .addClass("form-invalid")
                .removeClass("form-valid");
              input.check = false;
            }
          });
        } else {
          $(input.element).on("input propertychange", function() {
            if (input.regex.test($(this).val())) {
              $(this)
                .parent()
                .addClass("form-valid")
                .removeClass("form-invalid");
              input.check = true;
            } else {
              $(this)
                .parent()
                .addClass("form-invalid")
                .removeClass("form-valid");
              input.check = false;
            }
          });
        }
      });
    },
    confirmGuestInfo() { //Bu method ile form kurallarina gore doldurulursa devam butununu aktif ediyorum.
      $(".booking-guest-info-container").find("input, select").on("input propertychange, change", function() {
          if (
            guest.inputs.name.check &&
            guest.inputs.surname.check &&
            guest.inputs.gender.check &&
            guest.inputs.email.check &&
            guest.inputs.countryCode.check &&
            guest.inputs.mobile.check &&
            guest.inputs.birthdate.check
          ) {
            $(".toCreditCard .continue-button").removeClass("disabled");
          } else {
            $(".toCreditCard .continue-button").addClass("disabled");
          }
        });
    },
    init() {
      this.formValidation();
      this.confirmGuestInfo();
      this.skipGuestInfo();
    }
  }

  setTimeout(function() {
    guest.init();
  }, 10);

  $(".toCreditCard .continue-button").on("click", function() {
    guest.skipGuestInfo();
    $("body").addClass("isLoading");
    guest.prepareReservation();
  });

/*MARKUP HTML SABLON ISLEMLERI */

  var bookingSummary = {
    info : {
      amount: 0,
    },
    maleGuestInfo() {
      if(product.male > 0) {  // erkek misafir varsa

        var maleGuestContext = {
          maleGuestNumber: product.male,
          hour: date.totalHours,
          price: selectedLocation.room.price.toFixed(2),
          currencyCode: selectedLocation.room.currencyCode
        };

        var maleGuestTemplate = document.getElementById("maleGuestTemplate").firstChild.textContent;
        $("#male-guest-content").html(Mark.up(maleGuestTemplate, maleGuestContext));

      }
    },
    femaleGuestInfo() {
      if(product.female > 0) {  // bayan misafir varsa

        var femaleGuestContext = {
          femaleGuestNumber: product.female,
          hour: date.totalHours,
          price: selectedLocation.room.price.toFixed(2),
          currencyCode: selectedLocation.room.currencyCode
        };

        var femaleGuestTemplate = document.getElementById("femaleGuestTemplate").firstChild.textContent;
        $("#female-guest-content").html(Mark.up(femaleGuestTemplate,femaleGuestContext));

      }
    },
    bookingSummaryInfo() {
      if(selectedLocation.room.name !== "" && date.totalHours > 0) {
      var bookingSummaryContext = {
        airport: selectedLocation.airport.name,
        area: selectedLocation.area.name,
        checkInDate: date.checkIn.day,
        checkOutDate: date.checkOut.day,
        maleGuestNumber: product.male,
        femaleGuestNumber: product.female,
        checkInTime: date.checkIn.time,
        checkOutTime: date.checkOut.time,
        totalHour: date.totalHours
      };
      var bookingSummaryTemplate = document.getElementById("bookingInfoSummaryTemplate").firstChild.textContent;
        $("#booking-info-summary-content").html(Mark.up(bookingSummaryTemplate,bookingSummaryContext));
      }
    },
    amountSummaryInfo() {
      var info = this.info;
      if(selectedLocation.room.name !== "" && date.totalHours > 0) {
      var subTotal = 2 * date.totalHours * selectedLocation.room.price;
      var currencyCode = selectedLocation.room.currencyCode;
      var totalGuest = parseInt(product.male) + parseInt(product.female);
      var discountRate = selectedLocation.room.discountRate;
      var vateRate =  selectedLocation.room.vateRate;
      var vatePrice = Number((subTotal * Number(vateRate) / 100).toFixed(2));
      var accommodationRate = selectedLocation.room.accommodationRate;
      var accommodationPrice =  Number((subTotal * Number(accommodationRate) / 100).toFixed(2));
      var totalPrice = subTotal + vatePrice + accommodationPrice;
      info.amount = totalPrice;
      var amountSummaryContext = {
        toplamYolcu: totalGuest,
        ilkTutar: subTotal.toFixed(2),
        paraBirimi: currencyCode,
        indirimOrani: discountRate,
        kdvOrani: vateRate,
        kdvUcreti: vatePrice,
        konaklamaVergisiOrani: accommodationRate,
        konaklamaVergiUcreti: accommodationPrice,
        toplamFiyat: totalPrice.toFixed(2)
      };
      var amountSummaryTemplate = document.getElementById("amountSummaryInfoTemplate").firstChild.textContent;
        $(".amount-summary-content").html(Mark.up(amountSummaryTemplate,amountSummaryContext));
      }      
    },
    init() {
      this.bookingSummaryInfo();
      this.maleGuestInfo();
      this.femaleGuestInfo();
      this.amountSummaryInfo();
    }
  };

  setTimeout(function() {
    bookingSummary.init();
  }, 10);

  $(".comfirm-button").on("click", function() {
    bookingSummary.maleGuestInfo();
    bookingSummary.femaleGuestInfo();
    bookingSummary.bookingSummaryInfo();
    bookingSummary.amountSummaryInfo();
  });


  /* Backend'in kullanacagi bilgileri SETLIYORUM (application ID zaten Backend'de burada o bilgi haric digerlerini aldim.) */

  var rezervasyonBilgileri = {
    info: {
      plannedEntryTime: "",
      plannedExitTime: "",
      locationId: "locationId",
      areaId: "",
      roomTypeId: "",
      rawPrice: 0,
      amount: 0,
      currencyId: "",
      maleCount: "",
      femaleCount:""
    },
    prepareBookingInfo() {
      var info = this.info;
      info.plannedEntryTime = this.generatePlannedEntryTime(date.checkIn.day,date.checkIn.time);
      info.plannedExitTime = this.generatePlannedExitTime(date.checkOut.day,date.checkOut.time);
      info.locationId = selectedLocation.airport.locationId;
      info.areaId = selectedLocation.area.areaId;
      info.roomTypeId = selectedLocation.room.roomCategoryId;
      info.rawPrice = selectedLocation.room.rawPrice;
      info.amount = bookingSummary.info.amount.toFixed(2);
      info.currencyId = selectedLocation.room.currencyId;
      info.maleCount = product.male;
      info.femaleCount = product.female;
    },
    generatePlannedEntryTime(day, time) {
      return day.concat("T",time,":00.000Z");
    },
    generatePlannedExitTime(day, time) {
      return day.concat("T",time,":00.000Z");
    },
    init() {
      this.prepareBookingInfo();
    }
    
  };
  setTimeout(function() {
    rezervasyonBilgileri.init();
  }, 10);
  

  $(".toGuestInfo .continue-button").on("click", function() {
    rezervasyonBilgileri.prepareBookingInfo();  // backend in ihtiyaci olan rezervasyon detayini iceren data model'i hazirliyorum.
  });

/*SELECTBOX TA SECILEN DEGERIN SPAN ICINE YAZILMASI (CALISTIRAMADIM) */

  (function (a) {
    a.fn.extend({
        iStyler: function (d) {
            var b = { wrapper: false, customClass: "", passiveIco: "", activeIco: "" };
            var c = a.extend(b, d);
            return this.each(function (h) {
                var m = c,
                    l = a(this),
                    p = l.prop("tagName").toLowerCase(),
                    n = "",
                    i,
                    f,
                    g = m.passiveIco + m.activeIco;
                if (p == "select") {
                    var o = a("option:selected", l).text();
                    if (!l.hasClass("sSelect")) {
                        if (!m.wrapper) {
                            l.css({ opacity: 0, "-webkit-appearance": "none" })
                                .addClass("sSelect")
                                .before('<div class="sStylerWrp"><span class="sStyleHolder"><span class="sStyler">' + o + "</span>" + g + "</span></div>");
                        } else {
                            l.css({ opacity: 0, "-webkit-appearance": "none" })
                                .addClass("sSelect")
                                .wrap('<span class="sStylerMainWrp ' + m.customClass + ' sStylerWrp_select"></span>')
                                .before('<div class="sStylerWrp"><span class="sStyleHolder"><span class="sStyler">' + o + "</span>" + g + "</span></div>");
                        }
                    }
                    l.change(function () {
                        o = a("option:selected", l).text();
                        l.prev(".sStylerWrp").children(".sStyleHolder").children(".sStyler").text(o);
                    });
                } else {
                    if (p == "input" && l.attr("type") == "checkbox") {
                        if (!l.hasClass("sCheckbox")) {
                            n = l.is(":checked") ? n + " checked" : "";
                            if (!m.wrapper) {
                                l.addClass("sCheckbox").before('<span class="cStyler' + n + '">' + g + "</span>");
                            } else {
                                l.addClass("sCheckbox")
                                    .wrap('<span class="sStylerMainWrp ' + m.customClass + ' sStylerWrp_checkbox"></span>')
                                    .before('<span class="cStyler' + n + '">' + g + "</span>");
                            }
                        }
                        l.prev("span.cStyler")
                            .unbind("click")
                            .click(function () {
                                f = !l.is(":checked");
                                if (l.onclick != undefined) {
                                    l.attr("checked", f).click();
                                    l.attr("checked", f);
                                } else {
                                    l.click();
                                }
                                if (f) {
                                    a(this).addClass("checked");
                                } else {
                                    a(this).removeClass("checked");
                                }
                            });
                        l.change(function () {
                            if (l.is(":checked")) {
                                l.prev("span.cStyler").addClass("checked");
                            } else {
                                l.prev("span.cStyler").removeClass("checked");
                            }
                        });
                    } else {
                        if (p == "input" && l.attr("type") == "radio") {
                            if (!l.hasClass("sRadio")) {
                                i = l.attr("name");
                                var k;
                                k = i == undefined ? "" : ' name="' + i + '"';
                                if (l.is(":checked")) {
                                    n = n + " checked";
                                } else {
                                    n = "";
                                }
                                if (!m.wrapper) {
                                    l.addClass("sRadio").before("<span" + k + ' class="rStyler' + n + '">' + g + "</span>");
                                } else {
                                    l.addClass("sRadio")
                                        .wrap('<span class="sStylerMainWrp ' + m.customClass + ' sStylerWrp_radio"></span>')
                                        .before("<span" + k + ' class="rStyler' + n + '">' + g + "</span>");
                                }
                            }
                            l.prev("span.rStyler")
                                .unbind("click")
                                .click(function () {
                                    if (!l.is(":checked")) {
                                        f = !l.is(":checked");
                                        if (l.onclick != undefined) {
                                            l.attr("checked", f).click();
                                            l.attr("checked", f);
                                        } else {
                                            l.click();
                                        }
                                        if (i != undefined) {
                                            a('span.rStyler[name="' + i + '"]').removeClass("checked");
                                        }
                                        a(this).addClass("checked");
                                    }
                                });
                            l.change(function () {
                                if (l.is(":checked")) {
                                    if (i != undefined) {
                                        a('span.rStyler[name="' + i + '"]').removeClass("checked");
                                    }
                                    l.prev("span.rStyler").addClass("checked");
                                }
                            });
                        }
                    }
                }
            });
        },
    });
  
  $('.ems-styler-active').iStyler();





})(jQuery);