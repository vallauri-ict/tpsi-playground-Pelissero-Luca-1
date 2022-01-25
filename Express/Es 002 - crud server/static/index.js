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
    console.log(collections);
    let label = divCollections.children("label");
    for (const collection of collections) {
      let clone = label.clone();
      clone.appendTo(divCollections);
      clone.children("input").val(collection.name);
      clone.children("span").text(collection.name);
      divCollections.append("<br>");
    }
    label.remove();
  });




  divCollections.on("click", "input[type='radio']", function() {
    currentCollection = $(this).val();



    let request = inviaRichiesta("GET", "/api/" + currentCollection);
    request.fail(errore);
    request.done((data) => {
      console.log(data);
      divIntestazione.find("strong").eq(0).text(currentCollection);
      divIntestazione.find("strong").eq(1).text(data.length);
      if (currentCollection == "Unicorns") {
        filters.show();
      } else {
        filters.hide();
      };


      let tbody = table.children("tbody");
      tbody.empty();
      for (const item of data) {
        let tr = $("<tr>");
        tbody.append(tr);

        let td = $("<td>");
        td.appendTo(tr);
        td.text(item._id);
        td.prop("_id", item._id);
        td.prop("method", "get");
        td.on("click", visualizzaDettagli);

        td = $("<td>");
        td.appendTo(tr);
        td.text(item.name);
        td.prop("_id", item._id);
        td.prop("method", "get");
        td.on("click", visualizzaDettagli);

        td = $("<td>");
        td.appendTo(tr);

        $("<div>").appendTo(td).prop({"_id": item._id, "method": "patch"}).on("click", visualizzaDettagli);

        $("<div>").appendTo(td).prop({"_id": item._id, "method": "put"}).on("click", visualizzaDettagli);
        
        $("<div>").appendTo(td).prop("_id", item._id).on("click", elimina);
      }
    });
  });



  function elimina() {
    let request = inviaRichiesta("delete", "/api/" + currentCollection + "/" + $(this).prop("_id"));
    request.fail(errore);
    request.done((data) => {
      alert("Documento cancellato correttamente");
      aggiorna();
    });
  }


  let aggiorna = () => {
    let event = jQuery.Event('click');
    event.target = divCollections.find('input[type=radio]:checked')[0];
    divCollections.trigger(event);
  }

  function visualizzaDettagli() {
    // attenzione, in questo caso non sarebbe andato
    // fare this con la arrow func, in quanto non avrebbe
    // modificato il this
    let method = $(this).prop("method").toUpperCase();
    let id = $(this).prop("_id");

    let request = inviaRichiesta("get", "/api/" + currentCollection + "/" + id);
    request.fail(errore);
    request.done((data) => {
      divDettagli.empty();
    
      console.log(data);
      let content = "";
      for (const key in data) {
        content += "<strong>" + key + ":</strong> " + data[key] + "<br>";
      }
      divDettagli.append(content);
      if (method != "GET") {
        divDettagli.empty();
        let txtArea = $("<textarea>");
        delete data._id;
        txtArea.val(JSON.stringify(data, null, 2));
        txtArea.appendTo(divDettagli);

        visualizzaPulsanteInvia(method, id);
      }
    });
  };

  let visualizzaPulsanteInvia = (method, id = "") => {
    let btnInvia = $("<button>");
    btnInvia.text("Invia");
    btnInvia.appendTo(divDettagli);
    btnInvia.on("click", () => {
      alert(txtArea.val());
      let param = "";
      try {
        param = JSON.parse(txtArea.val());
      } catch {
        alert("Json non valido");
        return;
      }

      let request = inviaRichiesta(method, "/api/" + currentCollection + "/" + id, param);
      request.fail(errore);
      request.done(() => {
        alert("operazione avvenuto correttamente");
        divDettagli.empty();
        aggiorna();
      });
    });
  };

  $("#btnAdd").on("click", () => {
    divDettagli.empty();
    let txtArea = $("<textarea>");
    txtArea.val("{ }");
    txtArea.appendTo(divDettagli);

    visualizzaPulsanteInvia("post");
  });
});