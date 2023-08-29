

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
        button1.onclick = function(){clanInfoFun(body.rows[i].clan_name)};
        // button.onclick = function(){clanInfoFun(button.textContent)}
        cell1.appendChild(button1);   
        row.appendChild(cell1);

        let button2 = document.createElement("button");
        button2.textContent = "Join";
        cell2.appendChild(button2);
        row.appendChild(cell2);
        table.appendChild(row);

    }
    console.log(body.rows);

});

function clanInfoFun(clanName){
    window.location.href = `/clan-pages?unique_id=${clanName}`;
}