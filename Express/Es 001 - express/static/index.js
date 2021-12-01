$(document).ready(function () {

    $("#btnInvia").on("click", function () {
        let request = inviaRichiesta("get", "/api/risorsa1", { "nome": "pippo" });
        request.fail(errore);
        request.done(function (data) {
            alert(JSON.stringify(data));
        });
    });

    $("#btnInvia2").on("click", function () {
        let request = inviaRichiesta("post", "/api/risorsa1", { "nome": "pluto" });
        request.fail(errore);
        request.done(function (data) {
            alert(JSON.stringify(data));
        });
    });
});