
$(document).ready(function () {
    let _select = $("#select");

    let request = inviaRichiesta("GET", "/api/facts");
    request.fail(errore);
    request.done(function (data) {
        for (const facts of data) {
            $("<option>").text(facts._id).prop("val", facts.value).appendTo(_select)
        }
    });

    _select.prop("selectedIndex", -1);

    _select.on("change", function () {
        // console.log($(this).find(":selected").prop("val"))
        $("#txtVal").text($(this).find(":selected").prop("val"))
        $("#txtVal").prop("idFact", $(this).find(":selected").text())
    })

    $("#txtVal").on("change keyup paste", function () {
        $("#txtVal").text($(this).val())
    })

    $("#btnSalva").on("click", function () {
        let request = inviaRichiesta("post", "/api/salvaFacts", {"facts": $("#txtVal").text(), "id": $("#txtVal").prop("idFact")});
        request.fail(errore);
        request.done(function (data) {
            console.log(data);
        });
    });
});