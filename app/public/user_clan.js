

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
        document.getElementsByTagName("tr")[x].remove();
    }

    document.getElementById("welcomeUser").textContent = "Welcome   to your clan!";  
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

    }
});