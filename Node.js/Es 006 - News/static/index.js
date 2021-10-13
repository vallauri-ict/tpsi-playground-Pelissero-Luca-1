"use strict"

$(document).ready(function() {
    let _wrapper = $("#wrapper");
    let _divNotizia = $("#news");

    onload();

    function onload() {
        let requestElenco = inviaRichiesta("GET", "/api/elenco");
        requestElenco.fail(errore);
        requestElenco.done(function(data) {
            _wrapper.empty();
            for (const notizia of data) {
                let spanTitolo = $("<span>");
                spanTitolo.addClass("titolo");
                spanTitolo.text(notizia.titolo);
                spanTitolo.appendTo(_wrapper);
                let a = $("<a>");
                a.prop("href", "#");
                a.text("Leggi")
                a.on("click", leggi);
                a.prop("file", notizia.file)
                a.appendTo(_wrapper);
                let spanVis = $("<span>");
                spanVis.addClass("nVis");
                spanVis.text(`[Visualizzato ${notizia.visualizzazioni} volte]`)
                spanVis.appendTo(_wrapper);
                $("<br>").appendTo(_wrapper);
            }
        })
    }

    function leggi() {
        let requestDettagli = inviaRichiesta("POST", "/api/dettagli", { "file": $(this).prop("file") });
        requestDettagli.fail(errore)
        requestDettagli.done(function(data) {
            _divNotizia.html(data.file);
            onload();
        })
    }
})