"use strict"

$(document).ready(function() {
    let divIntestazione = $("#divIntestazione")
    let divCollections = $("#divCollections")
    let table = $("#mainTable")
    let divDettagli = $("#divDettagli")
    let filters = $(".card").first();
    let currentCollection = "";

    filters.hide();

    let request = inviaRichiesta("get", "/api/getCollections");
    request.fail(errore)
    request.done(function(collections) {
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

    divCollections.on("click","input[type=radio]",function(){
        currentCollection = $(this).val();
        let request = inviaRichiesta("get","/api/" + currentCollection);
        request.fail(errore);
        request.done(function aggiornaTabella(data){
            console.log(data);
            divIntestazione.find("strong").eq(0).text(currentCollection);
            divIntestazione.find("strong").eq(1).text(data.length);
            if(currentCollection == "unicorns")
            {
                filters.show();
            }
            else
            {
                filters.hide();
            }
            table.children("tbody").empty();
            for (const item of data) {
                let tr = $("<tr>").appendTo(table.children("tbody"));

                let td = $("<td>").appendTo(tr).text(item["_id"]).prop("id",item._id).on("click",dettagli);
                td = $("<td>").appendTo(tr).text(item.name).prop("id",item._id).on("click",dettagli);
                td = $("<td>").appendTo(tr);
                // creo 3 div, il resto è gestito dal css (3 icone)
                for (let i = 0; i < 3; i++) {
                    $("<div>").appendTo(td);
                }
            }
        })
    });

    function dettagli()
    {
        let id = $(this).prop("id");
        let request = inviaRichiesta("get","/api/" + currentCollection + "/" + id);
        request.fail(errore);
        request.done(function(data){
            console.log(data);
            let content = "";
            for (let key in data) {
                content += "<strong>" + key + ":</strong> " + data[key] + "<br>";
            }
            divDettagli.html(content);
        })
    }

    $("#btnAdd").on("click",function(){
        divDettagli.empty();
        let textarea = $("<textarea>").val("{ }").appendTo(divDettagli);

        let btnInvia = $("<button>").text("INVIA").appendTo(divDettagli);
        btnInvia.on("click",function(){
            let param = "";
            try 
            {
                param = JSON.parse(textarea.val());
            } 
            catch (error)
            {
                alert("Errore: JSON non valido");
                return;
            }

            let request = inviaRichiesta("post","/api/" + currentCollection, param);
            request.fail(errore);
            request.done(function(data){
                alert("Inserimento eseguito correttamente");
                divDettagli.empty();
                divCollections.trigger("click","input[type=radio]");
            });
        });
    });

});