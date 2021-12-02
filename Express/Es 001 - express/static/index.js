$(document).ready(function () {

    $("#btnInvia").on("click", function () {
        let request = inviaRichiesta("get", "/api/risorsa1", { "nome": "pippo" });
        request.fail(errore);
        request.done(function (data) {
            if (data.lenght) {
                alert(JSON.stringify(data));
            }
            else{
                alert("Corrispondenza non trovata")
            }
        });
    });

    $("#btnInvia2").on("click", function () {
        let request = inviaRichiesta("post", "/api/risorsa2", { "nome": "pluto", "vampires": 3 });
        request.fail(errore);
        request.done(function (data) {
            if (data.modifiedCount > 0) {
                alert("Aggiornamento eseguito correttamente")
            }
            else {
                alert("nessuna corrispondenza trovata")
            }
        });
    });

    $("#btnInvia3").on("click", function () {
        let request = inviaRichiesta("post", "/api/risorsa3/m/brown");
        request.fail(errore);
        request.done(function (data) {
            console.log(data)
        });
    });
});