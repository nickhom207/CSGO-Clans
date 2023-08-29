let play_now = document.getElementById("play");
let pmeter = [];

for (let i = 0; i < 5; i++) {
    pmeter.push(document.getElementById(i+1));
}

play_now.onclick = function() {
    let info = JSON.stringify({"unique_id" : clan_id});
    fetch(`/play-now?unique_id=${clan_id}`, {method: "POST", headers: {"Content-Type": "application/json"}, body: info})
    .then((response) => {
        return;
    });
}

socket.on("play-cancel", message => {
    for (let i = 0; i < 5; i++) {
        pmeter[i].style.backgroundColor = "white";
    }
    if (message!= 5) {
        alert("Not Enough Players found");
    }
});

socket.on("play-now", message => {
    console.log(message);
    if (message["players"]) {
        let num = message["players"].length;
        for (let i = 0; i < num; i++) {
            pmeter[i].style.backgroundColor = "green";
        }
    }   
    
});

socket.on("players-found", message => {
    console.log(message);
    let str = "";
    for (let i = 0; i < 5; i++) {
        str += message["players"][i] + ",";
    }
    alert("Party found: \n" + str);
});