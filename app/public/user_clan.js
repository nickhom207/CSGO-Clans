

let userID = "1001";

fetch(`/user_clan?userID=${userID}`).then((response) => {
    return response.json();
})
.then((body) => {
    console.log(body);

    if(body.rows.length == 0){
        document.getElementById("welcomeUser").textContent = "The user has not joine a clan yet.";
        return;
    }

    // get the count of rows of the table with id="train-table"
    var rowCount = document.getElementById('clans').rows.length;

    
    for (var x=rowCount; x>0; x--) {
        document.getElementsByTagName("tr")[x].remove();
    }

    document.getElementById("welcomeUser").textContent = "Welcome   to your clan!";  
    // body.rows[0].username
    console.log(body.rows.clans);

    // display data
    // for(let i = 0; i < body.rows.length; i++){
    //     var row = document.createElement("tr");
    //     var cell1 = document.createElement("td");
    //     cell1.textContent = body.rows[i].title;
    //     var cell2 = document.createElement("td");
    //     cell2.textContent = body.rows[i].genre;
    //     var cell3 = document.createElement("td");
    //     if(body.rows[i].quality){
    //         cell3.textContent = "yes";
    //     }
    //     else{
    //         cell3.textContent = "no";
    //     }


    //     row.appendChild(cell1);
    //     row.appendChild(cell2);
    //     row.appendChild(cell3);

    //     table.appendChild(row);

    // }
});