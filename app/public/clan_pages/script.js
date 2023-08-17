const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const clanName = urlParams.get('clanName');
console.log(clanName);

fetch(`/clan-info?clanName=${clanName}`).then((response) => {
    return response.json();
})
.then((body) => {
    const clanNameElement = document.getElementById('clanName');
    clanNameElement.textContent = "CLAN: " + clanName;
    const ifPublicElement = document.getElementById('ifPublic');
    if(body.rows[0].public){
        ifPublicElement.textContent = "This clan is public!";
    }else{
        ifPublicElement.textContent = "This clan is private!";
    }
    const clanDescriptionElement = document.getElementById('clanDescription');
    clanDescriptionElement.textContent = "CLAN DESCRIPTION: " + body.rows[0].clan_description;
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

    const clanChatElement = document.getElementById('clanChat');
    for(let i = 0; i < body.rows[0].chat.length; i++){
        clanChatElement.textContent += body.rows[0].chat[i] + "\n";
    }

    console.log(body.rows);


});

const clanNameElement = document.getElementById('clanName');
clanNameElement.innerHTML = clanName;

