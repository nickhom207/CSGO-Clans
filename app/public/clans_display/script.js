

fetch(`/all-public-clan-info`).then((response) => {
    return response.json();
})
.then((body) => {
    table = document.getElementById("dataTable");
    for(let i = 0; i < body.rows.length; i++){
        let row = document.createElement("tr");
        let cell1 = row.insertCell(-1);
        let cell2 = row.insertCell(-1);


        let button1 = document.createElement("button");
        button1.textContent = body.rows[i].clan_name;
        button1.onclick = function(){clanInfoFun(body.rows[i].unique_id)};
        // button.onclick = function(){clanInfoFun(button.textContent)}
        cell1.appendChild(button1);   
        row.appendChild(cell1);

        let button2 = document.createElement("button");
        button2.textContent = "Join";
        button2.onclick = function(){clanJoinFun(body.rows[i].unique_id)};
        cell2.appendChild(button2);
        row.appendChild(cell2);
        table.appendChild(row);

    }
    console.log(body.rows);

});

function clanInfoFun(unique_id){
    window.location.href = `/clan-pages?unique_id=${unique_id}`;
}

function clanJoinFun(unique_id){
    console.log(unique_id);
    let info = JSON.stringify({"unique_id" : unique_id});
    fetch("/join-clan", {method: "POST", headers: {"Content-Type": "application/json"}, body: info} 
    ).then((response) => {
        respCode = response.status;
        return response.text();
    }).then((body) => {
        if (respCode != 200) {
            console.log(body);
            alert("You have already joined this clan!");
            return;
        }
        alert("You have joined the clan!");
            window.location.href = `/clan-pages?unique_id=${unique_id}`;

    });
}

function callJoinClan(){
    var privateClanUniqueId = document.getElementById("privateClanJoin").value;
    clanJoinFun(privateClanUniqueId);
}