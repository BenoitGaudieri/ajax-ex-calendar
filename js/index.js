$(document).ready(function () {
    /**
     * Setup
     */
    // Start month
    var baseMonth = moment("2018-01-01");

    // Button references
    var prevMonth = $(".prev-month");
    var nextMonth = $(".next-month");

    // Selector reference
    var selector = $("#locale-sel");

    // Init handlebars
    var source = $("#day-template").html();
    var template = Handlebars.compile(source);

    // Generate calendar
    genCalendar(baseMonth, template);

    // Buttons logic
    nextMonth.click(function () {
        changeMonth(baseMonth, template, "add");
    });

    prevMonth.click(function () {
        changeMonth(baseMonth, template, "subtract");
    });

    // Selector logic

    selector.change(() => {
        changeLocale(baseMonth, $("#locale-sel option:selected").val());
        genCalendar(baseMonth, template);
    });
    //
}); // end Doc ready

/**
 * Functions
 */

//  Display days of the month
function printMonth(template, date) {
    // Moment.js method to get days num
    var daysInMonth = date.daysInMonth();

    // Set header
    $("h1").html(date.format("MMMM YYYY"));

    // Set data-attr with date as reference for holiday display
    $(".month").attr("data-this-date", date.format("YYYY-MM-DD"));

    // Loop on all days num
    for (let i = 0; i < daysInMonth; i++) {
        // Format date with moment.js
        var thisDate = moment({
            year: date.year(),
            month: date.month(),
            day: i + 1,
        });

        // set handlebars template
        var context = {
            class: "day " + "w" + thisDate.day(),
            day: thisDate.format("DD"),
            week: thisDate.format("ddd"),
            completeDate: thisDate.format("YYYY-MM-DD"),
        };

        // compile and append template
        var html = template(context);
        $(".month-list").append(html);
    }

    // hide arrows if jan or dec
    if (date.month() != 0 && date.month() != 11) {
        $(".prev-month").show();
        $(".next-month").show();
    } else if (date.month() == 0) {
        $(".prev-month").hide();
    } else {
        $(".next-month").hide();
    }
}

// display holidays
function printHoliday(date) {
    // chiamata API
    $.ajax({
        url: "https://flynn.boolean.careers/exercises/api/holidays",
        method: "GET",
        // api params from the date
        data: {
            year: date.year(),
            month: date.month(),
        },
        success: function (res) {
            var holidays = res.response;

            // loop through all the response
            for (let i = 0; i < holidays.length; i++) {
                var thisHoliday = holidays[i];

                // select the li with data-attr of the current holiday
                // select data-attr with square brackets
                var listItem = $(
                    "li[data-complete-date='" + thisHoliday.date + "']"
                );

                // if is part of the response then it is holiday
                if (listItem) {
                    listItem.addClass("holiday");
                    listItem.append(
                        "<span class='holy-d'>" + thisHoliday.name + "</span>"
                    );
                }
            }
        },
        error: function (err) {
            console.log(err);
        },
    });
}

// Calendar generator
function genCalendar(baseMonth, template) {
    // clear previous display
    $(".month-list").html("");

    // display days
    printMonth(template, baseMonth);

    // get holidays
    printHoliday(baseMonth);

    week(baseMonth);
}

/**
 * Change month using moment.js method based on the type of operation passed
 * @param {momentObj} baseMonth
 * @param {handlebars template} template
 * @param {operation} string
 */
function changeMonth(baseMonth, template, operation) {
    if (operation === "add") {
        if (baseMonth.month() != 11) {
            baseMonth.add(1, "months");
        } else {
            alert("Non c'è altro tempo al di fuori del 2018");
        }
    } else {
        if (baseMonth.month() != 0) {
            baseMonth.subtract(1, "months");
        } else {
            alert("Non c'è altro tempo al di fuori del 2018");
        }
    }
    genCalendar(baseMonth, template);
}

/**
 * Change locale
 * @param {baseMonth}
 * @param {locale}
 */
function changeLocale(baseMonth, locale = "en") {
    baseMonth.locale(locale);
    moment.locale(locale);
}

function week(baseMonth) {
    var week = moment.weekdaysShort();
    $(".weeks-label").html("");
    for (let i = 0; i < week.length; i++) {
        $(".weeks-label").append("<li class='wday'>" + week[i] + "</li>");
    }
}
