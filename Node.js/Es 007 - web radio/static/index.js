"use strict"

$(document).ready(function() { 
    let lstRegioni = $("#lstRegioni");
    let tbody = $("#tbody");

    lstRegioni.on("change", radios);

    let requestElenco = inviaRichiesta("GET", "/api/elenco")
    requestElenco.fail(errore);
    requestElenco.done(function (data) {
        for (let i = 0; i < data.length; i++) {
            let option = $("<option>");
            option.text(data[i].split('-')[0]+" ["+data[i].split('-')[1]+" emittenti]")
            option.val(data[i].split('-')[0])
            option.appendTo(lstRegioni)
        }
    })

    function radios() {
        let requestRadios = inviaRichiesta("POST", "/api/radios", { "region": $(this).val() })
        requestRadios.fail(errore);
        requestRadios.done(function (data) {
            for (const item of data) {
                let tr = $("<tr>").appendTo(tbody)
                let td = $("<td>").appendTo(tr)
                $("<img>").prop("src", item.favicon).css("width", "40px").appendTo(td);
                $("<td>").text(item.name).appendTo(tr);
                $("<td>").text(item.codec).appendTo(tr);
                $("<td>").text(item.bitrate).appendTo(tr);
                $("<td>").text(item.votes).appendTo(tr);
                td = $("<td>").appendTo(tr)
                $("<img>").prop({"src": "./like.jpg"}, {"id": item.id}).css("width", "40px").on("click", like).appendTo(td);
            }
        })
    }

    function like() {
        let id = $(this).prop("id")
        let requestLike = inviaRichiesta("POST", "/api/like", {"idRadio": $(this).prop("id")})
        requestLike.fail(errore);
        requestLike.done(function (data) {
            tbody.empty()
            lstRegioni.trigger("change")
        })
    }
})
