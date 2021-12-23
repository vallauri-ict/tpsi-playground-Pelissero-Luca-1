"use strict"

$(document).ready(function () {
    let divIntestazione = $("#divIntestazione")
    let divCollections = $("#divCollections")
    let table = $("#mainTable")
    let divDettagli = $("#divDettagli")
    let filters = $(".card").first();
    let currentCollection = "";

    filters.hide();

    let request = inviaRichiesta("get", "/api/getCollections");
    request.fail(errore)
    request.done(function (collections) {
        console.log(collections);
        let label = divCollections.children("label");
        for (const collection of collections) {
            let clone = label.clone();
            clone.appendTo(divCollections);
            clone.children("span").text(collection.name);
            clone.children("input").val(collection.name);
            divCollections.append("<br>");
        }
        label.remove();
    })

    divCollections.on("click", "input[type=radio]", function () {
        currentCollection = $(this).val();
        let request = inviaRichiesta("get", "/api/" + currentCollection);
        request.fail(errore);
        request.done(disegnaTabella(data))
    });

    function disegnaTabella(data) {
        divIntestazione.find("strong").eq(0).text(currentCollection);
        divIntestazione.find("strong").eq(1).text(data.length);
        if (currentCollection == "unicorns") {
            filters.show();
        }
        else {
            filters.hide();
        }
        table.children("tbody").empty();
        for (const item of data) {
            let tr = $("<tr>").appendTo(table.children("tbody"));

            let td = $("<td>").appendTo(tr).text(item["_id"]).prop({ "_id": item._id, "method": "get" }).on("click", dettagli);
            td = $("<td>").appendTo(tr).text(item.name).prop({ "_id": item._id, "method": "get" }).on("click", dettagli);
            td = $("<td>").appendTo(tr);

            $("<div>").appendTo(td).prop({ "_id": item._id, "method": "patch" }).on("click", dettagli);
            $("<div>").appendTo(td).prop({ "_id": item._id, "method": "put" }).on("click", dettagli);
            $("<div>").appendTo(td).prop("_id", item._id).on("click", elimina);
        }
    }

    function elimina() {
        let request = inviaRichiesta("delete", "/api/" + currentCollection + "/" + $(this).prop("id"))
        request.fail(errore);
        request.done(function () {
            alert("Documento rimosso correttamente");
            aggiorna();
        })
    }

    function dettagli() {
        let id = $(this).prop("_id");
        let method = $(this).prop("method").toUpperCase();

        let request = inviaRichiesta("GET", "/api/" + currentCollection + "/" + id);
        request.fail(errore);
        request.done(function (data) {
            console.log(data);
            if (method == "GET") {
                let content = "";
                for (let key in data) {
                    content += "<strong>" + key + ":</strong> " + data[key] + "<br>";
                    divDettagli.html(content);
                }
            }
            else {
                divDettagli.empty();
                let textarea = $("<textarea>");
                delete (data._id);
                textarea.text(JSON.stringify(data, null, 2))
                textarea.appendTo(divDettagli)
                textarea.css("height", textarea.get(0).scrollHeight + "px")

                visualizzaBtnInvia(method, id);
            }
        })
    }

    function visualizzaBtnInvia(method, id = "") {
        let btnInvia = $("<button>").text("INVIA").appendTo(divDettagli);
        btnInvia.on("click", function () {
            let param = "";
            try {
                param = JSON.parse(divDettagli.children("textarea").val());
            }
            catch (error) {
                alert("Errore: JSON non valido");
                return;
            }

            let request = inviaRichiesta(method, "/api/" + currentCollection + "/" + id, param);
            request.fail(errore);
            request.done(function () {
                alert("Operazione eseguita correttamente");
                divDettagli.empty();
                aggiorna();
            });
        });
    }

    $("#btnAdd").on("click", function () {
        divDettagli.empty();
        $("<textarea>").val("{ }").appendTo(divDettagli);

        visualizzaBtnInvia("POST");
    });

    function aggiorna() {
        var event = jQuery.Event('click');
        event.target = divCollections.find('input[type=radio]:checked')[0];
        divCollections.trigger(event);
    }

    $("#btnFind").on("click", function () {
        let filterJson = {}
        let hair = $("#lstHair").children("option:selected").val()
        if (hair)
            filterJson["hair"] = hair.toLowerCase();

        let male = filters.find("input[type=checkbox]").first()
            .is(":checked")
        let female = filters.find("input[type=checkbox]").last()
            .is(":checked")
        if (male && !female)
            filterJson["gender"] = 'm';
        else if (female && !male)
            filterJson["gender"] = 'f';

        let request = inviaRichiesta("get", "/api/" + currentCollection, filterJson)
        request.fail(errore)
        request.done(disegnaTabella())
    })

});