// Descrizione
// Creare un calendario dinamico con le festività. Partiamo dal gennaio 2018 dando la possibilità di cambiare mese, gestendo il caso in cui l’API non possa ritornare festività. Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull’API).
// Ogni volta che cambio mese dovrò:
// Controllare se il mese è valido (per ovviare al problema che l’API non carichi holiday non del 2018)
// Controllare quanti giorni ha il mese scelto formando così una lista
// Chiedere all’api quali sono le festività per il mese scelto
// Evidenziare le festività nella lista
// BONUS OPZIONALE:
// Trasformare la lista precedente in un vero e proprio calendario, generando una griglia che segua l’andamento dei giorni di un mese a scelta, evidenziando le festività.`
// Creare dei bottoni che permettano di spostarsi di mese in mese, rigenerando ogni volta la griglia e le festività associate
$(document).ready(function () {
    /**
     * Setup
     */
    // Start month
    var baseMonth = moment("2018-01-01");
    var prevMonth = $(".prev-month");
    var nextMonth = $(".next-month");

    // Init handlebars
    var source = $("#day-template").html();
    var template = Handlebars.compile(source);

    genCalendar(baseMonth, template);

    nextMonth.click(function () {
        changeMonth(baseMonth, template, "add");
    });

    prevMonth.click(function () {
        changeMonth(baseMonth, template, "subtract");
    });

    //
}); // end Doc ready
/**
 * Functions
 */

//  Stampa a schermo i giorni del mese
function printMonth(template, date) {
    // Numero giorni del mese
    var daysInMonth = date.daysInMonth();

    // setta header
    $("h1").html(date.format("MMMM YYYY"));

    // Imposta data attribute data
    $(".month").attr("data-this-date", date.format("YYYY-MM-DD"));

    // genera giorni mese
    for (let i = 0; i < daysInMonth; i++) {
        // genera data con moment js
        var thisDate = moment({
            year: date.year(),
            month: date.month(),
            day: i + 1,
        });

        // imposta dati template
        var context = {
            class: "day",
            day: thisDate.format("DD MMMM"),
            completeDate: thisDate.format("YYYY-MM-DD"),
        };

        // compilare e aggiungere template
        var html = template(context);
        $(".month-list").append(html);
    }
}

// Ottieni e stampa festività
function printHoliday(date) {
    // chiamata API
    $.ajax({
        url: "https://flynn.boolean.careers/exercises/api/holidays",
        method: "GET",
        data: {
            year: date.year(),
            month: date.month(),
        },
        success: function (res) {
            var holidays = res.response;

            for (let i = 0; i < holidays.length; i++) {
                var thisHoliday = holidays[i];

                // get attr with square brackets
                var listItem = $(
                    "li[data-complete-date='" + thisHoliday.date + "']"
                );

                if (listItem) {
                    listItem.addClass("holiday");
                    listItem.text(listItem.text() + "- " + thisHoliday.name);
                }
            }
        },
        error: function (err) {
            console.log(err);
        },
    });
}

function genCalendar(baseMonth, template) {
    $(".month-list").html("");
    // display giorni
    printMonth(template, baseMonth);

    // ottieni festività mese corrente
    printHoliday(baseMonth);
}

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
