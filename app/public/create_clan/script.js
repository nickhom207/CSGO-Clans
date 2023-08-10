let submit = document.getElementById("submit");
let message = document.getElementById("works");

submit.onclick = function () {
    console.log("made it");

    let name = document.getElementById("clan_name").value;
    let desc = document.getElementById("clan_desc").value;
    // let public = document.querySelector('input[name="public"]:checked');
    // var publicVal = public ? public.value : "";
    let public = document.getElementById("public").checked;
    console.log(public);
    fetch(`/create-clan?name=${name}&desc=${desc}&unique_id=${createRandomCode()}&public=${public}`
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