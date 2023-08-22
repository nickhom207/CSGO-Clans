// var table = document.getElementById("clans");
var clanList = document.getElementById("clanList");


fetch(`/user-info?steamID=${steamID}`).then((response) => {
    return response.json();
})
.then((body) => {
    if(!body.rows || body.rows.length == 0){
        document.getElementById("welcomeUser").textContent = body.error;
        return;
    }
    // get the count of rows of the table with id="train-table"
    // let rowCount = document.getElementById('clans').rows.length;

    document.getElementById("welcomeUser").textContent = "Welcome " + body.rows[0].username + " to your Profile!"; 
    document.getElementById("userName").innerHTML = "<b>User Name</b>: " + body.rows[0].username; 
    document.getElementById("steamId").innerHTML = "<b>Steam ID</b>: " + steamID;
    document.getElementById("region").innerHTML = "<b>Region</b>: " + body.rows[0].region;

    // body.rows[0].username
    console.log(body.rows[0].clans);
    let clans = body.rows[0].clans;

    // display data
    for(let i = 0; i < clans.length; i++){
        fetch(`/user-clan-name-detail?clanID=${body.rows[0].clans[i]}`).then((response) => {
            return response.json();
        })
        .then((body) => {
            let button = document.createElement("button");
            button.textContent = body.rows[0].clan_name;
            button.onclick = function(){clanInfoFun(clans[i])};
            clanList.appendChild(button);

        });
    }
});


function clanInfoFun(clanName){
    window.location.href = `/clan-pages?unique_id=${clanName}`;
}