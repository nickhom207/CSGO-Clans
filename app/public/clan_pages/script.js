fetch(`/clan-info?unique_id=${clan_id}`).then((response) => {
    return response.json();
})
.then((body) => {
    document.getElementById('clan').textContent = "Welcome to " + body.rows[0].clan_name + " page!";
    document.getElementById('clanName').innerHTML = "<b >Clan Name: </b><br>" + body.rows[0].clan_name;
    document.getElementById('clanId').innerHTML = "<b>Clan ID: </b><br>" + body.rows[0].unique_id;
    document.getElementById('clanDescription').innerHTML = "<b>Clan Description: </b><br> " + body.rows[0].clan_description;
    const ifPublicElement = document.getElementById('ifPublic');
    if(body.rows[0].public){
        document.getElementById('ifPublic').innerHTML = "<b>Clan Status: </b><br> Public";
    }else{
        document.getElementById('ifPublic').innerHTML = "<b>Clan Status: </b><br> Private";
    }

    const clanMembersElement = document.getElementById('clanMembers');
    for(let i = 0; i < body.rows[0].member_ids.length; i++){
        fetch(`/user-name-info?steamID=${body.rows[0].member_ids[i]}`).then((response) => {
            return response.json();
        })
        .then((body) => {
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            cell1.textContent = body.rows[0].username;
            row.appendChild(cell1);
            clanMembersElement.appendChild(row);
        });
    }
});

