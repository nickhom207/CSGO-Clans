fetch("/user").then((response) => {
	response.json().then(body => {
		if(!body.hasOwnProperty("id")){
			console.log("error fetching user data");
		}
		else{
			console.log(body);
			document.getElementById("name").textContent = body.displayName;
			document.getElementById("pfp").src = body.photos[0].value;
			document.getElementById("profile").href = body._json.profileurl;
		}
	})
});