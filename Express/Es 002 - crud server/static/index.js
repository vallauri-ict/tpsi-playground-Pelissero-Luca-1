"use strict"

$(document).ready(function () {
    let filters = $(".card").first();
    let divIntestazione = $("#divIntestazione")
    let divCollections = $("#divCollections")
    let table = $("#mainTable")
    let divDettagli = $("#divDettagli")
    let currentCollection = "";

    filters.hide();

    let request = inviaRichiesta("get", "/api/getCollections");
    request.fail(errore)
    request.done(function (collections) {
        let label = divCollections.children("label");

        for (const collection of collections) {
            let clone = label.clone();
            clone.appendTo(divCollections)
            clone.children("input").val(collection.name)
            clone.children("span").text(collection.name);
            divCollections.appendTo("<br>")
        }
        label.remove();
    })

    divCollections.on("click", "input[type=radio]", function () {
        currentCollection = $(this).val();
        let request = inviaRichiesta("GET", "/api/" + currentCollection)
        request.fail(errore)
        request.done(function (data) {
            divIntestazione.find("strong").eq(0).text(currentCollection)
            divIntestazione.find("strong").eq(0).text(data.length)
            if (currentCollection == "unicorns") {
                filters.show();
            }
            else {
                filters.hide();
            }
            table.children("tbody").empty()
            for (const item of data) {
                let tr = $("<tr>").appendTo(table.children("tbody"))
                let td = $("<td>").appendTo(tr).text(item._id).prop("id", item._id).on("click", visualizzaDettagli)
                td = $("<td>").appendTo(tr).text(item.name).prop("id", item._id).on("click", visualizzaDettagli)
                for (let i = 0; i < 3; i++) {
                    $("<div>").appendTo(td);
                }
            }
        })
    })

    function visualizzaDettagli() {
        let request = inviaRichiesta("GET", "/api/" + currentCollection + "/" + $(this).prop("id"))
        request.fail(errore);
        request.done(function (data) {
            let content = "";
            for (const key in data[0]) {
                content += "<strong>" + key + ":</strong> " + data[0][key] + "<br>";
                divDettagli.html(content);
            }
        })
    }
});