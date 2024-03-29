var _baseInternalAPIURL = "https://www.keplerclub.com/";
var selectedLocation = {
    airport: {
        name: "",
        code: "",
        locationId: ""
    },
    area: {
        name: "",
        areaId: "",
    },
    room: {
        roomCategoryId: "",
        name: "",
        unitCapacity: 0,
        maleCapacity: 0, 
        femaleCapacity: 0,
        price: 0,
        rawPrice: 0,
        discountRate: 0,
        vateRate: 0,
        accommodationRate: 0,
        currencyCode: "",
        currencyId: ""
    }
}

var step = function (stepNumber) {

    $('.stp-1').addClass('hide');
    $('.stp-2').addClass('hide');
    $('.stp-3').addClass('hide');
    $('.stp-4').addClass('hide');
    $('.stp-5').addClass('hide');

    $('.stp-' + stepNumber).removeClass('hide');

    $('.booking-step-container').removeClass('step-1 step-2 step-3 step-4 step-5').addClass('step-' + stepNumber);

    $('.booking-form').scrollTop(0);

};

step(1);

$(".toGuestInfo .previous-step-button").on("click", function (e) {
    e.preventDefault();
    step(1);
});

$(document).on('click', '.bi-button-back', function (e) {
    e.preventDefault();
    step(1);
});

$(".toGuestInfo .continue-button").on("click", function (e) {
    e.preventDefault();
    step(3);
});



$(".toCreditCard .previous-step-button").on("click", function (e) {
    e.preventDefault();
    step(2);
});

$(".toPayment .previous-step-button").on("click", function (e) {
    e.preventDefault();
    step(3);
});

var debounce = function (func, delay) {
    var debounceTimer;
    return function () {
        var context = this;
        var args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            return func.apply(context, args);
        }, delay);
    };
};

$(".book-session-first-step").on('DOMSubtreeModified', debounce(function () {

    var airport = selectedLocation.airport.name;
    var area = selectedLocation.area.name;
    var room = selectedLocation.room.name;
    var male = parseInt(product.male);
    var female = parseInt(product.female);
    var unit = parseInt(product.unit);
    var checkIn = date.checkIn.time;
    var checkOut = date.checkOut.time;

    if (airport && area && room && (male > 0 || female > 0 || unit > 0) && checkIn && checkOut) {
        $('.comfirm-button').removeClass('disabled');
    } else {
        $('.comfirm-button').addClass('disabled');
    }

}));

var airport = {
    fetchAirpots() {
        $.ajax({
            type: "GET",
            url: _baseInternalAPIURL + "api/KeplerService/Get?id=1",
            //url: "https://www.keplerclub.com/api/KeplerService/Get?id=1",
            crossDomain: true,
            success: function (response) {

                // Set airports
                var $airports = $('#airports');

                response.webLocations.map(function (item) {
                    $airports.append('<option value="' + item.locationId + '">' + item.name + '</option>');
                });

                // Set areas and rooms on change
                $airports.on('change', function () {

                    var airportIndex = $airports.find('option:selected').index() - 1;

                    // Set areas
                    var $areas = $('#areas');
                    $areas.val('').trigger('change');
                    $areas.find('option').not(':first-child').remove();

                    if (airportIndex > -1) {
                        response.webLocations[airportIndex].areas.map(function (item) {
                            $areas.append('<option value="' + item.areaId + '">' + item.name + '</option>');
                        });
                    }

                    // Resetleme
                    selectedLocation = {
                        airport: {
                            name: "",
                            code: "",
                            locationId: ""
                        },
                        area: {
                            name: "",
                            areaId: "",
                        },
                        room: {
                            roomCategoryId: "",
                            name: "",
                            unitCapacity: 0,
                            maleCapacity: 0,
                            femaleCapacity: 0,
                            price: 0,
                            rawPrice: 0,
                            discountRate: 0,
                            vateRate: 0,
                            accommodationRate: 0,
                            currencyCode: "",
                            currencyId: ""
                        }
                    };

                    if (airportIndex !== -1) {
                        selectedLocation.airport.name = response.webLocations[airportIndex].name;
                        selectedLocation.airport.locationId = response.webLocations[airportIndex].locationId;
                        selectedLocation.airport.code = response.webLocations[airportIndex].code;
                    }

                    // Clear rooms
                    $rooms.val('').trigger('change');

                    $rooms.find('option').not(':first-child').remove();

                });

                // Area deÄŸiÅŸince yapÄ±lacak iÅŸlemler
                var $areas = $('#areas');

                $areas.on('change', function () {

                    var airportIndex = $airports.find('option:selected').index() - 1;
                    var areaIndex = $areas.find('option:selected').index() - 1;
                    
                    if (areaIndex > -1) {
                        
                        selectedLocation.area.name = response.webLocations[airportIndex].areas[areaIndex].name;
                        selectedLocation.area.areaId = response.webLocations[airportIndex].areas[areaIndex].areaId;
                        
                        // Set rooms
                        var $rooms = $('#rooms');

                        response.webLocations[airportIndex].roomInfoList.map(function (item) {
                            $rooms.append('<option value="' + item.roomCategoryId + '">' + item.name + '</option>');
                        });

                    }

                });

                // Rooms deÄŸiÅŸince yapÄ±lacak iÅŸlemler
                var $rooms = $('#rooms');

                $rooms.on('change', function () {

                    $('#male').attr('max', 0);
                    $('#male').val(0);
                    $('.maleNumber').text(0);

                    $('#female').attr('max', 0);
                    $('#female').val(0);
                    $('.femaleNumber').text(0);
                    
                    $('#unit').attr('max', 0);
                    $('#unit').val(0);
                    $('.unitNumber').text(0);

                    $('.guest-adult').addClass('ems-none');
                    $('.guest-unit').addClass('ems-none');

                    $('.time-area-title').addClass('ems-none');
                    $('.time-area-data').addClass('ems-none');

                    var airportIndex = $airports.find('option:selected').index() - 1;
                    var roomIndex = $rooms.find('option:selected').index() - 1;

                    if (roomIndex > -1) {

                        selectedLocation.room.roomCategoryId = response.webLocations[airportIndex].roomInfoList[roomIndex].roomCategoryId;
                        selectedLocation.room.name = response.webLocations[airportIndex].roomInfoList[roomIndex].name;
                        selectedLocation.room.unitCapacity = response.webLocations[airportIndex].roomInfoList[roomIndex].unitCapacity;
                        selectedLocation.room.maleCapacity = response.webLocations[airportIndex].roomInfoList[roomIndex].maleCapacity;
                        selectedLocation.room.femaleCapacity = response.webLocations[airportIndex].roomInfoList[roomIndex].femaleCapacity;
                        selectedLocation.room.price = response.webLocations[airportIndex].roomInfoList[roomIndex].price;
                        selectedLocation.room.rawPrice = response.webLocations[airportIndex].roomInfoList[roomIndex].rawPrice;
                        selectedLocation.room.discountRate = response.webLocations[airportIndex].roomInfoList[roomIndex].discountRate;
                        selectedLocation.room.vateRate = response.webLocations[airportIndex].roomInfoList[roomIndex].vateRate;
                        selectedLocation.room.accommodationRate = response.webLocations[airportIndex].roomInfoList[roomIndex].accommodationRate;
                        selectedLocation.room.currencyCode = response.webLocations[airportIndex].roomInfoList[roomIndex].currencyCode;
                        selectedLocation.room.currencyId = response.webLocations[airportIndex].roomInfoList[roomIndex].currencyId;
                        selectedLocation.room.isCabin = response.webLocations[airportIndex].roomInfoList[roomIndex].isCabin;

                        if (selectedLocation.room.isCabin) {
                            product.male = 0;
                            product.female = 0;
                            product.unit = 0;
                            $('.guest-adult').removeClass('ems-none');
                        } else {
                            product.male = 0;
                            product.female = 0;
                            product.unit = 0;
                            $('.guest-unit').removeClass('ems-none');
                        }

                        $('#male').attr('max', selectedLocation.room.maleCapacity);
                        $('#female').attr('max', selectedLocation.room.femaleCapacity);
                        $('#unit').attr('max', selectedLocation.room.unitCapacity);

                        $('.time-area-title').removeClass('ems-none');
                        $('.time-area-data').removeClass('ems-none');
    
                    }

                });

            },
            dataType: "json",
            timeout: 30000,
            error: function () {
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
        $(".cvc-mark").bind("click", function () {
            $(".cvc-info-tooltip").toggleClass("ems-none");
        });

        $(".cvc-info-close").bind("click", function () {
            $(".cvc-info-tooltip").addClass("ems-none");
        });

        $("#cvc").bind("focus", function () {
            $(".cvc-info-tooltip").addClass("ems-none");
        });
    },
    /*TERM OF USE BILDIRIM ALANINI ACIP KAPATAN SCRIPT */
    birthDateWarning() {
        var isOpen = false;
        var maxDate = setDate(-7, 0, 0);
        var currentMaxDate = maxDate.substr(0, 4);
        var _yearRange = "1900:" + currentMaxDate;

        $("#birthdate").on("focus", function () {
            if (!isOpen) {
                $("body").addClass(date.elements.datePicker.ready);
                $(".child-warning").removeClass(cls.none);
                $(".warning-background").removeClass(cls.none);
                $("#birthdate").datepicker({
                    yearRange: _yearRange,
                    maxDate: "-7y",
                    changeMonth: true,
                    changeYear: true,
                    dateFormat: "dd/mm/yy",
                    showButtonPanel: false,
                });
                isOpen = true;
            }
        });

        $(".child-warning").bind("click", function () {
            $(".child-warning").addClass(cls.none);
            $(".warning-background").addClass(cls.none);
        });
    },
    privacyPolicyAndTermOfUseWarning() {
        // Privacy Policy AÃ§ar
        $(".pd-privacy").bind("click", function () {
            $(".pp-warning").removeClass(cls.none);
            $(".warning-background").removeClass(cls.none);
        });
        // Privacy Policy KapatÄ±r
        $(".pp-warning")
            .find(".form-close-button")
            .bind("click", function () {
                $(".pp-warning").addClass(cls.none);
                $(".warning-background").addClass(cls.none);
            });
        // Terms of Use AÃ§ar
        $(".pd-term").bind("click", function () {
            $(".tou-warning").removeClass(cls.none);
            $(".warning-background").removeClass(cls.none);
        });
        // terms of Use KapatÄ±r
        $(".tou-warning")
            .find(".form-close-button")
            .bind("click", function () {
                $(".tou-warning").addClass(cls.none);
                $(".warning-background").addClass(cls.none);
            });
    },
    postSonuclariWarning() {
        // postEdilen formlardan donen hatalarin gosterildigi popup i kapatÄ±r
        $(".postSonuclariWarning")
            .find(".form-close-button")
            .bind("click", function () {
                $(".postSonuclariWarning").addClass(cls.none);
                $(".warning-background").addClass(cls.none);
            });
    },
    iframeWarning() {
        // iframe popup i kapatÄ±r
        $(".iframeWarning")
            .find(".form-close-button")
            .bind("click", function () {
                $(".iframeWarning").addClass(cls.none);
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
            // AynÄ± gun degÄ±l ise zaman uayarÄ±sÄ±nÄ± aÃ§ar
            if (date.checkOut.day !== date.checkIn.day && date.selectedHours.length != 0) {
                $(".date-warning").removeClass(cls.none);
            }
        }
    },
    init() {
        this.birthDateWarning();
        this.cvcToolTip();
        this.privacyPolicyAndTermOfUseWarning();
        this.postSonuclariWarning();
        this.iframeWarning();
    },
}

setTimeout(function () {
    bookingEvents.init();
}, 10);




/*BOOKING FORM (Choose Location, Choose Area ve Room Category) alanlarÄ±nÄ±n dropdownlarÄ±nÄ±n kontrol eden script  */

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
function handleDropdown(dropdown, open) {
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
    unit: 0,

    setProductAmount(el) {
        var input = $(el).find("input");
        var nextStep = false;

        $(el)
            .find(this.elements.counter.button)
            .bind("click", function () {

                var value = parseInt(input.val());
                var type = $(this).attr("rel");
                var target = $(input.attr("data-target"));
                var max = input.attr("max");

                value = type === "inc" ? (value = value + 1) : (value = value - 1);

                value < 0 ? (value = 0) : input.val(value);

                if (value >= max) {
                    value = max;
                }

                target.length > 0 ? target.text(value) : 0;

                product[input.attr('id')] = value;

                input.val(value);

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
    .each(function () {
        product.setProductAmount(this);
    });

function logTimes(date) { }

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
            showButtonPanel: false,
            beforeShow: function(input, inst) {
                var dateCheck, dateWidth, dateHeight;
                setTimeout(function(){
                    if (  type.el === '#in-date' ) {
                        dateCheck = $('.check-in-info');
                    } else {
                        dateCheck = $('.check-out-info');
                    }
                    dateWidth = dateCheck.outerWidth() / 4;
                    dateHeight = dateCheck.outerHeight() + 10;
                    inst.dpDiv.css({
                        top: dateCheck.offset().top + dateHeight, 
                        left: dateCheck.offset().left - dateWidth,
                    });
                },1);
                $('.booking-form').off('kepler.scroll');
                $('.booking-form').on('scroll kepler.scroll', function(){
                    inst.dpDiv.css({
                        top: dateCheck.offset().top + dateHeight, 
                        left: dateCheck.offset().left - dateWidth,
                    });
                });
            }
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

        $(".check-in-info").bind("click", function () {
            $("body").addClass(date.elements.datePicker.ready);
            $("#in-date").datepicker("show");
            $(".check-out-info").removeClass(cls.active);
            $(".check-in-info").addClass(cls.active);
            date.checkIn.active = true;
            date.checkOut.active = false;
        });

        checkInDatepicker.on("change", function () {
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

        $(".check-out-info").bind("click", function () {
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

        checkOutDatePicker.on("change", function () {
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

        $(date.elements.calendar.button).each(function () {
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

        $(date.elements.calendar.button).bind("click", function () {
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

    checkTimes() {
        $(date.elements.timePicker.hours).each(function () {
            $(this).removeClass(cls.selectedTime);
            $(this).removeClass(cls.bookedTime);
            $(this).removeClass(cls.disabled);
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
        $(date.elements.timePicker.hours).bind("click", function () {
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

var parsers = {
    errorParser(msg) {
        $(".postSonuclariWarning .warning-content-wrapper")
            .find(".warning-title p")
            .text(msg);
        $(".warning-background").removeClass("ems-none");
        $(".postSonuclariWarning").removeClass("ems-none");
    },
    iframeWarning(content) {
        $(".iframeWarning .warning-content-wrapper")
            .find(".iframe-content p")
            .text(content);
        $(".warning-background").removeClass("ems-none");
        $(".iframeWarning").removeClass("ems-none");
    }
}

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
    passenger: {
        name: "",
        surname: "",
        gender: "",
        email: "",
        phoneNumber: "",
        birthDate: "",
        locationId: "",
        reservationList: [],
        reservationNo: ""
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
        info.locationId = selectedLocation.airport.locationId;
        info.reservationList = rezervationIdList.info.reservationList;
        info.reservationNo = rezervationIdList.info.reservationNo;
    },
    //MISAFIR BILGILERINI ALIP MODELE KAYDEDIYORUM
    addPassenger() {
        $.ajax({
            type: "POST",
            url: _baseInternalAPIURL + "api/KeplerService/AddPassenger",
            data: JSON.stringify({
                guest: guest.passenger,
            }),
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            success: function (resp) {

                if (resp.success) {

                    // Basarili ise bir sonraki adimda kullanilacak modele, rezervasyon id'yi setliyorum.
                    creditCart.paymentInfo.total = parseFloat(bookingSummary.info.amount).toFixed(2);

                    //Loading iconu kaldir
                    $("body").removeClass(cls.isLoading);

                    //Kredi karti bilgileri adimina gec
                    step(4);


                } else {

                    //DIKKAT - hata oluÅŸmuÅŸsa response.message keyinin kesin dolu gelmesi lazim.
                    $("body").removeClass("isLoading");
                    parsers.errorParser(resp.message);
                    step(3);
                }

            },
            error: function (resp) {
                if (resp != null) {
                    $("body").removeClass(cls.isLoading);
                    if (resp.responseJSON.errors[0].message != '' || resp.responseJSON.errors[0].message != null) {
                        parsers.errorParser(resp.responseJSON.errors[0].message);
                    } else {
                        parsers.errorParser("Yolcu bilgilerini kaydederken hata olustu! Error!");
                        step(3);
                    }
                } else {
                    parsers.errorParser("Yolcu bilgileri kaydetme adimina girilemedi!");
                    step(3);
                }

            },
        });
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
        inputArrays.forEach(function (input) {
            if (input.element == "#mobile") {
                $(input.element).on("input propertychange", function () {
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
                $(input.element).on("change", function () {
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
                $(input.element).on("change", function () {
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
                $(input.element).on("input propertychange", function () {
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
        $(".booking-guest-info-container").find("input, select").on("input propertychange, change", function () {
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

setTimeout(function () {
    guest.init();
}, 10);



$(".toCreditCard .continue-button").on("click", function (e) {
    $("body").addClass("isLoading");
    guest.skipGuestInfo();
    guest.addPassenger();
    e.preventDefault();
});



/* KREDI KARTI BILGISI FORMU  - KONTROLLER VS */
var creditCart = {
    // DOM
    elements: {
        container: ".card-wrapper",
    },
    // Inputs
    inputs: {
        cardholdername: {
            element: "#cardHolder",
            check: false,
            regex: /\w\D/,
        },
        cardnumber: {
            element: "#cardnumber",
            check: false,
            regex: /^[0-9]{9,13}$/,
        },
        expiration: {
            element: "#expiration",
            check: false,
            regex: /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/,
        },
        cvc: {
            element: "#cvc",
            check: false,
            regex: /^[0-9]{3,4}$/,
        },
        saveApprove: {
            element: "#saveApprove",
            check: false
        }
    },
    // Models
    paymentInfo: {
        reservationNo: "",
        cardHolderName: "",
        cardNumber: "",
        expireMonth: 0,
        expireYear: 0,
        cvvCode: "",
        installment: 0,
        cardType: "Master",
        manufacturerCard: true,
        reservationList: [],
        total: 0
    },
    skipPaymentInfo() {
        // Kisinin forma doldurdugu verileri model'ime aktariyorum.
        var info = this.paymentInfo;
        info.cardHolderName = $(creditCart.inputs.cardholdername.element).val();
        info.cardNumber = $(creditCart.inputs.cardnumber.element).val();
        info.expiration = $(creditCart.inputs.expiration.element).val();
        info.expireMonth = parseInt($(creditCart.inputs.expiration.element).val().substring(0, 2));
        info.expireYear = parseInt($(creditCart.inputs.expiration.element).val().substring(5, 9));
        info.cvvCode = $(creditCart.inputs.cvc.element).val();
        info.reservationList = rezervationIdList.info.reservationList;
        info.reservationNo = rezervationIdList.info.reservationNo;
    },
    //KREDI KARTI BILGILERINI ALDIM BANKAYA GIDIYORUM
    preparePayment() {
        $.ajax({
            type: "POST",
            url: _baseInternalAPIURL + "api/KeplerService/Sale3DFirstRequest",
            data: JSON.stringify({
                paymentInfo: creditCart.paymentInfo
            }),
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            success: function (resp) {
                if (resp.Result.success) {

                    // Basarili sonuc geldiyse iframe ac
                    parsers.iframeWarning(injectHTML(resp.Result.htmlForm));

                    //Loading iconu kaldir
                    $("body").removeClass(cls.isLoading);

                } else {

                    // Burada hata gelirse gerÃ§ekten response message key inde mi geliyor sorgula
                    $("body").removeClass("isLoading");
                    parsers.errorParser(resp.Result.errorMessage);
                    step(4);
                }

            },
            error: function (resp) {

                $("body").removeClass(cls.isLoading);
                parsers.errorParser("Sistemsel bir hata oluÅŸtu. LÃ¼tfen tekrar deneyiniz.");
                step(4);
            },
        });
    },
    formValidation() {
        var inputArrays = Object.values(this.inputs);
        inputArrays.forEach(function (input) {
            if (input.element == "#cardHolder") {
                $(input.element).on("input propertychange", function () {
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
            } else if (input.element == "#cardnumber") {
                $(input.element).on("change", function () {
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
            } else if (input.element == "#expiration") {
                $(input.element).on("change", function () {
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
            } else if (input.element == "#cvc") {
                $(input.element).on("change", function () {
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
            } else if (input.element == "#saveApprove") {
                $(input.element).on("change", function () {
                    if ($(this).is(':checked')) {
                        input.check = true;
                    } else {
                        input.check = false;
                    }
                });
            } else {
                $(input.element).on("input propertychange", function () {
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
    confirmPaymentInfo() { //Bu method ile form kurallarina gore doldurulursa ODEME YAP butununu aktif ediyorum.
        $(".payment-card-area").find("input, select").on("input propertychange, change", function () {
            if (
                creditCart.inputs.cardholdername.check &&
                creditCart.inputs.cardnumber.check &&
                creditCart.inputs.expiration.check &&
                creditCart.inputs.cvc.check &&
                creditCart.inputs.saveApprove.check
            ) {
                $(".toPayment .continue-button").removeClass("disabled");
            } else {
                $(".toPayment .continue-button").addClass("disabled");
            }
        });
    },
    init() {
        this.formValidation();
        this.confirmPaymentInfo();
        this.skipPaymentInfo();
    }
}

setTimeout(function () {
    creditCart.init();
}, 10);

$(".toPayment .continue-button").on("click", function () {
    $("body").addClass("isLoading");
    creditCart.skipPaymentInfo();
    creditCart.preparePayment();
    rezervasyonTamamlandi.finishReservation();
});














/*KREDI KARTI GORUNTUSU generate eden ve CVC alanÄ±na gelince kartÄ± Ã§eviren script */
var creditCard = new Card({
    form: document.querySelector("#credit-card-form"),
    container: ".card-wrapper",
    formSelectors: {
        numberInput: 'input#cardnumber', // optional â€” default input[name="number"]
        expiryInput: 'input#expiration', // optional â€” default input[name="expiry"]
        cvcInput: 'input#cvc', // optional â€” default input[name="cvc"]
        nameInput: 'input#cardHolder' // optional - defaults input[name="name"]
    },
    width: 320, // optional â€” default 350px
    messages: {
        validDate: 'valid\ndate', // optional - default 'valid\nthru'
        monthYear: 'mm/yy', // optional - default 'month/year'
    },
});




/*MARKUP HTML SABLON ISLEMLERI */

var bookingSummary = {
    info: {
        amount: 0,
        guestType: "",
        resTotal: 0
    },
    maleGuestInfo() {
        if (selectedLocation.airport.name !== "" && product.male > 0) {  // erkek misafir varsa
            $('.male-guest-content').removeClass("ems-none")
            var maleGuestContext = {
                maleGuestNumber: product.male,
                hour: date.totalHours,
                price: selectedLocation.room.price.toFixed(2),
                currencyCode: selectedLocation.room.currencyCode
            };

            var maleGuestTemplate = document.getElementById("maleGuestTemplate").firstChild.textContent;
            $(".male-guest-content").html(Mark.up(maleGuestTemplate, maleGuestContext));

        } else {
            $('.male-guest-content').addClass("ems-none");
        }
    },
    femaleGuestInfo() {
        if (selectedLocation.airport.name !== "" && product.female > 0) {  // bayan misafir varsa

            $('.female-guest-content').removeClass("ems-none");

            var femaleGuestContext = {
                femaleGuestNumber: product.female,
                hour: date.totalHours,
                price: selectedLocation.room.price.toFixed(2),
                currencyCode: selectedLocation.room.currencyCode
            };

            var femaleGuestTemplate = document.getElementById("femaleGuestTemplate").firstChild.textContent;
            $(".female-guest-content").html(Mark.up(femaleGuestTemplate, femaleGuestContext));

        } else {
            $('.female-guest-content').addClass("ems-none");
        }
    },
    unitGuestInfo() {
        if (selectedLocation.airport.name !== "" && product.unit > 0) {  // unit misafir varsa

            $('.unit-guest-content').removeClass("ems-none");

            var unitGuestContext = {
                unitGuestNumber: product.unit,
                hour: date.totalHours,
                price: selectedLocation.room.price.toFixed(2),
                currencyCode: selectedLocation.room.currencyCode
            };

            var unitGuestTemplate = document.getElementById("unitGuestTemplate").firstChild.textContent;
            $(".unit-guest-content").html(Mark.up(unitGuestTemplate, unitGuestContext));

        } else {
            $('.unit-guest-content').addClass("ems-none");
        }
    },
    bookingSummaryInfo() {
        if (selectedLocation.room.name !== "" && date.totalHours > 0) {
            $('.booking-info-summary-content').removeClass("ems-none");
            var bookingSummaryContext = {
                airport: selectedLocation.airport.name,
                area: selectedLocation.area.name,
                checkInDate: date.checkIn.day,
                checkOutDate: date.checkOut.day,
                maleGuestNumber: product.male,
                femaleGuestNumber: product.female,
                unitGuestNumber: product.unit,
                checkInTime: date.checkIn.time,
                checkOutTime: date.checkOut.time,
                totalHour: date.totalHours
            };
            var bookingSummaryTemplate = document.getElementById("bookingInfoSummaryTemplate").firstChild.textContent;
            $(".booking-info-summary-content").html(Mark.up(bookingSummaryTemplate, bookingSummaryContext));
        } else {
            $('.booking-info-summary-content').addClass("ems-none");
        }
    },
    amountSummaryInfo() {
        var info = this.info;
        if (selectedLocation.room.name !== "" && date.totalHours > 0) {
            $('.amount-summary-content').removeClass("ems-none");
            var currencyCode = selectedLocation.room.currencyCode;
            var totalGuest = 1;
            if (selectedLocation.room.isCabin) {
                totalGuest = parseInt(product.male) + parseInt(product.female);
                info.guestType = "cabin";
            } else {
                totalGuest = parseInt(product.unit);
                info.guestType = "room";
            }
            var yeniPrice = selectedLocation.room.rawPrice / (100 + selectedLocation.room.vateRate + selectedLocation.room.accommodationRate) * 100;
            var resTotal = 2 * date.totalHours * selectedLocation.room.rawPrice;
            var subTotal = 2 * date.totalHours * yeniPrice * totalGuest;
            var discountRate = selectedLocation.room.discountRate;
            var vateRate = selectedLocation.room.vateRate;
            var vatePrice = (selectedLocation.room.rawPrice / (100 + selectedLocation.room.vateRate + selectedLocation.room.accommodationRate) * selectedLocation.room.vateRate) * totalGuest * 2 * date.totalHours;
            var accommodationRate = selectedLocation.room.accommodationRate;
            var accommodationPrice = (selectedLocation.room.rawPrice / (100 + selectedLocation.room.vateRate + selectedLocation.room.accommodationRate) * selectedLocation.room.accommodationRate) * totalGuest * 2 * date.totalHours;
            var totalPrice = resTotal * totalGuest;
            info.amount = totalPrice;
            info.resTotal = resTotal;
            var amountSummaryContext = {
                konukTipi: info.guestType,
                toplamYolcu: totalGuest,
                ilkTutar: subTotal.toFixed(2),
                paraBirimi: currencyCode,
                indirimOrani: discountRate,
                kdvOrani: vateRate,
                kdvUcreti: vatePrice.toFixed(2),
                konaklamaVergisiOrani: accommodationRate,
                konaklamaVergiUcreti: accommodationPrice.toFixed(2),
                toplamFiyat: totalPrice.toFixed(2)
            };
            var amountSummaryTemplate = document.getElementById("amountSummaryInfoTemplate").firstChild.textContent;
            $(".amount-summary-content").html(Mark.up(amountSummaryTemplate, amountSummaryContext));
        } else {
            $('.amount-summary-content').addClass("ems-none");
        }
    },
    init() {
        this.bookingSummaryInfo();
        this.maleGuestInfo();
        this.femaleGuestInfo();
        this.unitGuestInfo();
        this.amountSummaryInfo();
    }
};

setTimeout(function () {
    bookingSummary.init();
}, 10);




//Ihtiyacim oldugunda kullanabilecegim reservationNo ve reservation listesi

var rezervationIdList = {
    // Models
    info: {
        reservationNo: "",
        reservationList: []
    },
}



/* Backend'in kullanacagi bilgileri SETLIYORUM (application ID zaten Backend'de burada o bilgi haric digerlerini aldim.) */

var rezervasyonBilgileri = {
    info: {
        plannedEntryTime: "",
        plannedExitTime: "",
        locationId: "",
        areaId: "",
        roomTypeId: "",
        rawPrice: 0,
        amount: 0,
        currencyId: "",
        maleCount: 0,
        femaleCount: 0,
        unitCount: 0,
        resTotal: 0

    },
    prepareBookingInfo() {
        var info = this.info;
        info.plannedEntryTime = this.generatePlannedEntryTime(date.checkIn.day, date.checkIn.time);
        info.plannedExitTime = this.generatePlannedExitTime(date.checkOut.day, date.checkOut.time);
        info.locationId = selectedLocation.airport.locationId;
        info.areaId = selectedLocation.area.areaId;
        info.roomTypeId = selectedLocation.room.roomCategoryId;
        info.rawPrice = selectedLocation.room.rawPrice;
        info.amount = bookingSummary.info.amount.toFixed(2);
        info.currencyId = selectedLocation.room.currencyId;
        info.maleCount = product.male;
        info.femaleCount = product.female;
        info.unitCount = product.unit;
        info.resTotal = bookingSummary.info.resTotal;
    },
    generatePlannedEntryTime(day, time) {
        return day.concat("T", time, ":00.000");
    },
    generatePlannedExitTime(day, time) {
        return day.concat("T", time, ":00.000");
    },

    //ILK ADIMDA SECILEN BILGILERI BIR USTTEKI METHOD DA MODELE SETLEYIP, ALTTAKI METHOD DA REZERVASYON OLUSABILIYOR MU DIYE BACKENDE GONDERIYORUM
    tryForReservation() {
        $.ajax({
            type: "POST",
            url: _baseInternalAPIURL + "api/KeplerService/AddReservation",
            data: JSON.stringify({
                rezervasyon: rezervasyonBilgileri.info
            }),
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            success: function (resp) {

                if (resp.success) {


                    //BASARILI CEVAP GELDI: Bir sonraki ekranda gosterilecek ozet bilgileri hazirliyorum.

                    //Ileri geri yaptiksa ve ekrana ozet daha once gosterilmisse once eskileri kaldiriyorum
                    $('.male-guest-content').addClass("ems-none");
                    $('.female-guest-content').addClass("ems-none");
                    $('.unit-guest-content').addClass("ems-none");
                    $('.booking-info-summary-content').addClass("ems-none");
                    $('.amount-summary-content').addClass("ems-none");

                    bookingSummary.bookingSummaryInfo();
                    bookingSummary.amountSummaryInfo();

                    if (selectedLocation.room.isCabin) {
                        bookingSummary.maleGuestInfo();
                        bookingSummary.femaleGuestInfo();
                    } else {
                        bookingSummary.unitGuestInfo();
                    }




                    // backendden gelen rezervasyon id listesini setliyorum.
                    if (resp.data.reservationList != null && resp.data.reservationNo != null) {
                        rezervationIdList.info.reservationList = resp.data.reservationList;
                        rezervationIdList.info.reservationNo = resp.data.reservationNo;
                    } else {
                        $("body").removeClass(cls.isLoading);
                        parsers.errorParser("Reservation numbers could not be created! Please try again!");
                        step(1);
                    }

                    //Loading iconu kaldiriyorum
                    $("body").removeClass(cls.isLoading);

                    //Ozet gosterilen kısma geç
                    step(2);


                } else {

                    //DIKKAT - hata olusmussa response.message keyinin kesin dolu gelmesi lazim.
                    $("body").removeClass("isLoading");
                    parsers.errorParser(resp.message);
                    step(1);
                }

            },
            error: function (resp) {
                if (resp != null) {
                    $("body").removeClass(cls.isLoading);
                    if (resp.responseJSON.errors[0].message != '' || resp.responseJSON.errors[0].message != null) {
                        parsers.errorParser(resp.responseJSON.errors[0].message);
                    } else {
                        parsers.errorParser("Rezervasyon olusturmada hata oldu! Error!");
                        step(1);
                    }
                } else {
                    parsers.errorParser("Rezervasyon adimina girilemedi!");
                    step(1);
                }

            },
        });
    },

    init() {
        this.prepareBookingInfo();
    }

};
setTimeout(function () {
    rezervasyonBilgileri.init();
}, 10);

$(".comfirm-button .continue-button").on("click", function () {
    bookingSummary.amountSummaryInfo();
    rezervasyonBilgileri.prepareBookingInfo();  // backend in ihtiyaci olan rezervasyon detayini iceren data model'i hazirliyorum.
    rezervasyonBilgileri.tryForReservation();  // rezervasyon yapmak icin backende istek atiyorum
});

/* REZERVASYON TAMAMLANDI */

var rezervasyonTamamlandi = {

    finishReservation() {

        if (rezervationIdList.info.reservationNo != '') {
            $('.payment-completed-summary-content').removeClass("ems-none");
            var finishSummaryContext = {
                reservationNo: rezervationIdList.info.reservationNo,
                airport: selectedLocation.airport.name,
                area: selectedLocation.area.name,
                checkInDate: date.checkIn.day,
                checkOutDate: date.checkOut.day,
                checkInTime: date.checkIn.time,
                checkOutTime: date.checkOut.time,
                totalHours: date.totalHours,
                guestType: bookingSummary.info.guestType,
                maleGuestNumber: product.male,
                femaleGuestNumber: product.female,
                unitGuestNumber: product.unit
            };
            var finishSummaryTemplate = document.getElementById("paymentCompletedTemplate").firstChild.textContent;
            $(".payment-completed-summary-content").html(Mark.up(finishSummaryTemplate, finishSummaryContext));
        } else {
            $('.payment-completed-summary-content').addClass("ems-none");
        }
    },
    init() {
        this.finishReservation();
    }
};
setTimeout(function () {
    rezervasyonTamamlandi.init();
}, 10);


/*REZERVASYON BITTI FORM KAPATIP MODELLERI SIFIRLA */
$('.completeReservation .continue-button').click(function (e) {

    if ($('#booking-form-wrapper').hasClass('booking-form-animate')) {
        $('#booking-form-wrapper').removeClass('booking-form-animate');
        $('body').css('overflow', '');        // scroll engeli kaldir
        $('#booking-form-wrapper').css('display', '')

        // Resetleme
        selectedLocation = {
            airport: {
                name: "",
                code: "",
                locationId: ""
            },
            area: {
                name: "",
                areaId: "",
            },
            room: {
                roomCategoryId: "",
                name: "",
                unitCapacity: 0,
                maleCapacity: 0,
                femaleCapacity: 0,
                price: 0,
                rawPrice: 0,
                discountRate: 0,
                vateRate: 0,
                accommodationRate: 0,
                currencyCode: "",
                currencyId: ""
            }
        };

    } else {
        $('#booking-form-wrapper').css('display', 'block');
        $('#booking-form-wrapper').addClass('booking-form-animate');
        $('body').css('overflow', 'hidden');  // scroll engelle
    }


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

function injectHTML(htmls) {

    var iframe = document.getElementById('bankiframe');

    var html_string = "" + htmls + "";

    var iframedoc = iframe.document;
    if (iframe.contentDocument)
        iframedoc = iframe.contentDocument;
    else if (iframe.contentWindow)
        iframedoc = iframe.contentWindow.document;

    if (iframedoc) {
        // Put the content in the iframe
        iframedoc.open();
        iframedoc.writeln(html_string);
        iframedoc.close();
    } else {
        alert('Cannot inject dynamic contents into iframe.');
    }
}
