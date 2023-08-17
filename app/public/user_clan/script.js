
let steamID = "76561198025039301";

let userID = "1000";
var table = document.getElementById("clans");
var clanList = document.getElementById("clanList");


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
        document.getElementsByTagName("tr")[x].remove();
    }

    document.getElementById("welcomeUser").textContent = "Welcome   to your clan!";  

    // body.rows[0].username
    console.log(body.rows[0].clans);

    // display data
    for(let i = 0; i < body.rows[0].clans.length; i++){
        fetch(`/user-clan-name-detail?clanID=${body.rows[0].clans[i]}`).then((response) => {
            return response.json();
        })
        .then((body) => {
            // console.log(body.rows);
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            cell1.textContent = body.rows[0].clan_name;
            row.appendChild(cell1);

            table.appendChild(row);

            let button = document.createElement("button");
            button.textContent = body.rows[0].clan_name;
            button.onclick = function(){clanInfoFun(button.textContent)}
            clanList.appendChild(button);

        });

    }
});


function clanInfoFun(clanName){
    console.log(clanName);
    window.location.href = `/clan_pages?clanName=${clanName}`;
}