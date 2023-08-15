
<<<<<<< HEAD

let userID = "1000";
var table = document.getElementById("clans");


fetch(`/user_clan?userID=${userID}`).then((response) => {
    return response.json();
})
.then((body) => {
    console.log(body);

    if(body.rows.length == 0){
        document.getElementById("welcomeUser").textContent = "The user has not joined a clan yet.";
        return;
    }

    // get the count of rows of the table with id="train-table"
    var rowCount = document.getElementById('clans').rows.length;

    
    for (var x=rowCount; x>0; x--) {
=======
let steamID = "76561198025039301";
var table = document.getElementById("clans");


fetch(`/user-clan?steamID=${steamID}`).then((response) => {
    return response.json();
})
.then((body) => {
    if(!body.rows || body.rows.length == 0){
        document.getElementById("welcomeUser").textContent = body.error;
        return;
    }
    // get the count of rows of the table with id="train-table"
    let rowCount = document.getElementById('clans').rows.length;
    
    for (let x=rowCount; x>0; x--) {
>>>>>>> 0dbb474b8ae96c19b4781dd69af59cd6df49c8d1
        document.getElementsByTagName("tr")[x].remove();
    }

    document.getElementById("welcomeUser").textContent = "Welcome   to your clan!";  
<<<<<<< HEAD
    // body.rows[0].username
    console.log(body.rows[0].clans);

    // display data
    for(let i = 0; i < body.rows[0].clans.length; i++){
        fetch(`/user_clan_detail?clanID=${i}`).then((response) => {
            return response.json();
        })
        .then((body) => {
            console.log(body);
        });
        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        cell1.textContent = body.rows[0].clans[i];

        row.appendChild(cell1);

        table.appendChild(row);

=======

    // display data
    for(let i = 0; i < body.rows[0].clans.length; i++){
        fetch(`/user-clan-detail?clanID=${body.rows[0].clans[i]}`).then((response) => {
            return response.json();
        })
        .then((body) => {
            // console.log(body.rows);
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            cell1.textContent = body.rows[0].clan_name;
            row.appendChild(cell1);

            table.appendChild(row);
        });
>>>>>>> 0dbb474b8ae96c19b4781dd69af59cd6df49c8d1
    }
});