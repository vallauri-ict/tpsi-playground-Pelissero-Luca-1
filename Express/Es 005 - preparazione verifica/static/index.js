$(document).ready(function () {
    let user = { "username": "", "room": "" }
    let serverSocket;
    let btnConnetti = $("#btnConnetti");
    let btnDisconnetti = $("#btnDisconnetti");
    let btnInvia = $("#btnInvia");
    let txtFile = $("#txtFile");

    btnDisconnetti.prop("disabled", true);
    btnInvia.prop("disabled", true);

    // mi connetto al server che mi ha inviato la pagina,
    // il quale mi restituisce il suo serverSocket
    // io.connect é SINCRONO, bloccante
    btnConnetti.click(function () {
        serverSocket = io({ transports: ['websocket'], upgrade: false }).connect();

        serverSocket.on('connect', function () {
            console.log("connessione ok");
            user.username = prompt("Inserisci lo username:");
            if (user.username == "pippo" || user.username == "pluto") {
                user.room = "room1";
            }
            else {
                user.room = "defaultRoom";
            }
            serverSocket.emit("login", JSON.stringify(user));
        });

        serverSocket.on('loginAck', function (data) {
            if (data == "NOK") {
                alert("Nome già esistente. Scegliere un altro nome")
                user.username = prompt("Inserisci un nuovo username:");
                serverSocket.emit("login", JSON.stringify(user));
            }
            else
                document.title = user.username;
        });

        serverSocket.on('message_notify', function (data) {
            // ricezione di un messaggio dal server			
            data = JSON.parse(data);
            console.log(data);
            visualizza(data);
        });

        serverSocket.on('disconnect', function () {
            alert("Sei stato disconnesso!");
        });

        btnConnetti.prop("disabled", true);
        btnDisconnetti.prop("disabled", false);
        btnInvia.prop("disabled", false);
    });

    // 2a) invio messaggio
    btnInvia.click(function () {
        let file = $("#txtFile").prop("files")[0];

        if (!file || $("#txtMessage").val() !== "") {
            let msg = $("#txtMessage").val();
            serverSocket.emit("message", msg);
            $("#txtMessage").val("");
        }
        else {
            let request = resizeAndConvert(file)
            request.catch(function (err) {
                console.log(err)
            })
            request.then(function (img) {
                serverSocket.emit("message", img);
            })
        }
    });

    // 3) disconnessione
    btnDisconnetti.click(function () {
        serverSocket.disconnect();
        btnDisconnetti.prop("disabled", true);
        btnConnetti.prop("disabled", false);
        btnInvia.prop("disabled", true);
    });


    //funzione per visualizzare i messaggi
    //username, message, date, icon
    function visualizza(data) {
        let username = data.from;
        let message = data.message;
        let date = data.date;
        let icon = data.icon;
        let img = data.img;
        let wrapper = $("#wrapper")
        let container = $("<div class='message-container'></div>");
        container.appendTo(wrapper);

        //icona dell'utente
        if (icon != "") {
            let image = $("<img>");
            image.css({ "width": "35px" });
            image.prop("src", icon);
            image.appendTo(container);
        }

        // username e date
        date = new Date(date);
        let mittente = $("<small class='message-from'>" + username + " @"
            + date.toLocaleTimeString() + "</small>");
        mittente.appendTo(container);

        // messaggio
        message = $("<p class='message-data'>" + message + "</p>");
        message.appendTo(container);

        //immagine grande
        if(img != "")
        {
            let image = $("<img>");
            image.css({"width" : "400px"});
            image.prop("src",img);
            image.appendTo(container);
        }

        // auto-scroll dei messaggi
        /* la proprietà html scrollHeight rappresenta l'altezza di wrapper oppure
           l'altezza del testo interno qualora questo ecceda l'altezza di wrapper
        */
        let h = wrapper.prop("scrollHeight");
        // fa scorrere il testo verso l'alto in 500ms
        wrapper.animate({ "scrollTop": h }, 500);
    }
});









/* *********************** RESIZE AND CONVERT ****************************** */
/* resize (tramite utilizzo della libreria PICA.JS) and base64 conversion    */
function resizeAndConvert(file) {
    /* step 1: lettura tramite FileReader del file binario scelto dall'utente.
               File reader restituisce un file base64
    // step 2: conversione del file base64 in oggetto Image da passare alla lib pica
    // step 3: resize mediante la libreria pica che restituisce un canvas
                che trasformiamo in blob (dato binario di grandi dimensioni)
    // step 4: conversione del blob in base64 da inviare al server               */
    return new Promise(function (resolve, reject) {
        const WIDTH = 640;
        const HEIGHT = 480;
        let type = file.type;
        let reader = new FileReader();
        reader.readAsDataURL(file) // restituisce il file in base 64
        //reader.addEventListener("load", function () {
        reader.onload = function () {
            let img = new Image()
            img.src = reader.result	 // reader.result restituisce l'immagine in base64  						
            img.onload = function () {
                if (img.width < WIDTH && img.height < HEIGHT)
                    resolve(reader.result);
                else {
                    let canvas = document.createElement("canvas");
                    if (img.width > img.height) {
                        canvas.width = WIDTH;
                        canvas.height = img.height * (WIDTH / img.width)
                    }
                    else {
                        canvas.height = HEIGHT
                        canvas.width = img.width * (HEIGHT / img.height);
                    }
                    let _pica = new pica()
                    _pica.resize(img, canvas, {
                        unsharpAmount: 80,
                        unsharpRadius: 0.6,
                        unsharpThreshold: 2
                    })
                        .then(function (resizedImage) {
                            // resizedImage è restituita in forma di canvas
                            _pica.toBlob(resizedImage, type, 0.90)
                                .then(function (blob) {
                                    var reader = new FileReader();
                                    reader.readAsDataURL(blob);
                                    reader.onload = function () {
                                        resolve(reader.result); //base 64
                                    }
                                })
                                .catch(err => reject(err))
                        })
                        .catch(function (err) { reject(err) })
                }
            }
        }
    })
}