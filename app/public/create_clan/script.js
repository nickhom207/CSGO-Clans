let submit = document.getElementById("submit");
let message = document.getElementById("works");

submit.onclick = function () {

    let name = document.getElementById("clan_name").value;
    let desc = document.getElementById("clan_desc").value;
    let public = document.getElementById("public").checked;
    
    let clanInfo = JSON.stringify({"name" : name, "desc" : desc, "unique_id" : createRandomCode(), "public" : public});
    fetch("/create-clan", {method: "POST", headers: {"Content-Type": "application/json"}, body: clanInfo}
    ).then((response) => {
        respCode = response.status;

        if (respCode === 200) {
                message.textContent = "Success";
        }
        else {
            message.textContent = "Bad request";
        }
    });
};

function createRandomCode() {
    let characters = "ABCDEFGHIJKLMNOPQRSTUXWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let code = "";

    for (let i = 0; i < 7; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}