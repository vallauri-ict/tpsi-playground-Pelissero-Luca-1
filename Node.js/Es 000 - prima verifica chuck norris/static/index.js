$(document).ready(function () {
  let lstCategories = $("#lstCategories");
  let main = $("#mainWrapper");
  let btnInvia = $("#btnInvia");

  let requestCategories = inviaRichiesta("GET", "/api/categories");
  requestCategories.fail(errore);
  requestCategories.done(function (data) {
    for (let i = 0; i < data.length; i++) {
      $("<option>").text(data[i]).val(data[i]).appendTo(lstCategories);
    }
    $("#btnAdd").prop("categoria", "career");
  });

  let requestFacts = inviaRichiesta("GET", "/api/facts", {
    categoria: "career",
  });
  requestFacts.fail(errore);
  requestFacts.done(function (data) {
    for (const fact of data) {
      $("<input>")
        .prop({ type: "checkbox", idFact: fact.id })
        .val(fact.id)
        .insertBefore(btnInvia);
      $("<span>").text(fact.value).insertBefore(btnInvia);
      $("<br>").insertBefore(btnInvia);
    }
  });

  lstCategories.on("change", function () {
    $("#btnAdd").prop("categoria", $(this).val());
    let requestFacts = inviaRichiesta("GET", "/api/facts", {
      "categoria": $(this).val(),
    });
    requestFacts.fail(errore);
    requestFacts.done(function (data) {
      main.children("input").remove();
      main.children("span").remove();
      main.children("br").remove();
      for (const fact of data) {
        $("<input>")
          .prop({ type: "checkbox", idFact: fact.id })
          .val(fact.id)
          .insertBefore(btnInvia);
        $("<span>").text(fact.value).insertBefore(btnInvia);
        $("<br>").insertBefore(btnInvia);
      }
    });
  });

  btnInvia.on("click", function () {
    let vetID = [];
    let preferiti = main.children("input");
    for (let i = 0; i < preferiti.length; i++) {
      if (preferiti[i].checked) {
        vetID.push(preferiti[i].idFact);
      }
    }
    let requestRate = inviaRichiesta("POST", "/api/rate", { ids: vetID });
    requestRate.fail(errore);
    requestRate.done(function (data) {
      console.log(data);
    });
  });

  $("#btnAdd").on("click", function () {
    let requestAdd = inviaRichiesta("POST", "/api/add", {
        "categoria": $(this).prop("categoria"),
        "value": $("#newFact").val()
    });
    requestAdd.fail(errore);
    requestAdd.done(function (data) {
        if(data.ok){
            lstCategories.trigger("change")
        }
    })
  });
});
