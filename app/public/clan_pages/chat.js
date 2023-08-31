let socket = io();

socket.on("message", message => {
    console.log(message);
});

socket.emit("join", clan_id);

let button = document.getElementById("submit");
let messages = document.getElementById("messages");
let br = document.createElement("br");

button.onclick = function () {
    let chatBox = document.getElementById("chat");
    let message = chatBox.value;

    formatMessage("sent", "You", message);
    chatBox.value = "";
    chatBox.focus();
    socket.emit("sendMessage", {"message" : message, "user" : username, "clan_id" : clan_id, "user_id" : user_id});
};

socket.on("recieveMessage", (msg) => {
    formatMessage("recieve", msg.user, msg.message);
});

socket.on("previousMessages", (msg) => {
    if (msg.user_id == user_id) {
        formatMessage("sent", msg.user, msg.message);
    }
    else {
        formatMessage("recieve", msg.user, msg.message);
    }
});

function formatMessage(type, user, message) {
    const date = new Date().toLocaleString();
    let div = document.createElement("div");

    let msgInfo = document.createElement("p");
    let info = document.createTextNode(user + " - " + date);
    msgInfo.id = "info";
    msgInfo.appendChild(info);
    div.appendChild(msgInfo)

    let messageP = document.createElement("p");
    let text = document.createTextNode(message);
    messageP.id = "msg";
    messageP.appendChild(text);

    div.appendChild(messageP);
    div.id=type;

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}