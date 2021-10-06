"use strict"

$(document).ready(function() {
    let _lstNazioni = $("#lstNazioni");
    let _tabStudenti = $("#tabStudenti");
    let _divDettagli = $("#divDettagli");

    _divDettagli.hide()

    let reqNazioni = inviaRichiesta("GET", "/api/nazioni");
    reqNazioni.fail(errore);
    reqNazioni.done(function(data) {
        console.log(data);
    })

});