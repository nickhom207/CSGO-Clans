
let steamID = "76561198025039301";
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

    // display data
    for(let i = 0; i < body.rows[0].clans.length; i++){
        fetch(`/user-clan-detail?clanID=${body.rows[0].clans[i]}`).then((response) => {
            return response.json();
        })
        .then((body) => {
            // console.log(body.rows);
            let button = document.createElement("button");
            button.textContent = body.rows[0].clan_name;
            button.onclick = function(){clanInfoFun(button.textContent)}


            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            cell1.textContent = body.rows[0].clan_name;
            // add button into cell1

            // cell1.innerHTML = "<button onclick='clanInfoFun(button.textContent)';>${body.rows[0].clan_name}</button>";
            row.appendChild(cell1);

            table.appendChild(row);


            
            // clanInfoFun(button.textContent);

            clanList.appendChild(button);

        });
    }
});

function clanInfoFun(clanName){
    console.log(clanName);
    window.location.href = `/clan-info?clanName=${clanName}`;

    // fetch(`/clan-info?clanName=${clanName}`).then((response) => {
    //     return response.json();
    // })
    // .then((body) => {
    //     console.log(body.rows);

    // });
}