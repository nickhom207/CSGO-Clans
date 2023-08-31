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

    console.log(body.rows[0].clans);

    // display data
    for(let i = 0; i < body.rows[0].clans.length; i++){
        fetch(`/clan-info?unique_id=${body.rows[0].clans[i]}`).then((response) => {
            return response.json();
        })
        .then((body) => {
            console.log(body)
            let button = document.createElement("button");
            button.textContent = body.rows[0].clan_name;
            button.onclick = function(){clanInfoFun(body.rows[0].unique_id)}
            clanList.appendChild(button);

        });
    }
});


function clanInfoFun(unique_id){
    console.log(unique_id);
    window.location.href = `/clan-pages?unique_id=${unique_id}`;
}
