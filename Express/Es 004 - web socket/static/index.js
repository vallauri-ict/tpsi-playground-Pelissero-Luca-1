$(document).ready(function () {
    let user = { "username": "", "room": "" }
    let serverSocket;
    let btnConnetti = $("#btnConnetti");
    let btnDisconnetti = $("#btnDisconnetti");
    let btnInvia = $("#btnInvia");

    btnDisconnetti.prop("disabled", true);
    btnInvia.prop("disabled", true);

    // mi connetto al server che mi ha inviato la pagina,
    // il quale mi restituisce il suo serverSocket
    // io.connect é SINCRONO, bloccante
    btnConnetti.on("click", function () {
        btnDisconnetti.prop("disabled", false);
        btnConnetti.prop("disabled", true);
        btnInvia.prop("disabled", false);

        serverSocket = io({ transports: ['websocket'], upgrade: false }).connect();

        /* 1a) lo username viene inviato SOLO a connessione avvenuta
           in questo modo si evita di connetere/disconnettere + volte */
        serverSocket.on('connect', function () {
            console.log("connessione ok");
            impostaUser();
            serverSocket.emit("login", JSON.stringify(user));
        });

        // 1b) utente valido / non valido
        serverSocket.on('loginAck', function (data) {
            if (data == "NOK") {
                alert("Nome già esistente. Scegliere un altro nome")
                impostaUser();
                serverSocket.emit("login", JSON.stringify(user));
            }
            else
                document.title = user.username;
        });

        // 2b) ricezione della risposta
        serverSocket.on('message_notify', function (data) {
            // ricezione di un messaggio dal server			
            data = JSON.parse(data);
            visualizza(data.from, data.message, data.date);
        });

        serverSocket.on('disconnect', function () {
            alert("Sei stato disconnesso!");
        });
    })

    // 2a) invio messaggio
    btnInvia.click(function () {
        let msg = $("#txtMessage").val();
        serverSocket.emit("message", msg);
        $("#txtMessage").val("");
    });

    // 3) disconnessione
    btnDisconnetti.click(function () {
        btnDisconnetti.prop("disabled", true);
        btnConnetti.prop("disabled", false);
        btnInvia.prop("disabled", true);

        serverSocket.disconnect();
    });

    function impostaUser() {
        user.username = prompt("Inserisci lo username:");
        if (user.username == "pippo" || user.username == "pluto") {
            user.room = "room1"
        }
        else {
            user.room = "defaultRoom"
        }
    };

    function visualizza(username, message, date) {
        let wrapper = $("#wrapper")
        let container = $("<div class='message-container'></div>");
        container.appendTo(wrapper);

        // username e date
        date = new Date(date);
        let mittente = $("<small class='message-from'>" + username + " @"
            + date.toLocaleTimeString() + "</small>");
        mittente.appendTo(container);

        // messaggio
        message = $("<p class='message-data'>" + message + "</p>");
        message.appendTo(container);

        // auto-scroll dei messaggi
        /* la proprietà html scrollHeight rappresenta l'altezza di wrapper oppure
           l'altezza del testo interno qualora questo ecceda l'altezza di wrapper
        */
        let h = wrapper.prop("scrollHeight");
        // fa scorrere il testo verso l'alto in 500ms
        wrapper.animate({ "scrollTop": h }, 500);
    }
});