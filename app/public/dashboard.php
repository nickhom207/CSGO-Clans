<?php
session_start();
if(!$_SESSION['logged_in']){
    header("location: redirect.html");
    exit();
}
$username = $_SESSION['userData']['name'];
$avatar = $_SESSION['userData']['avatar'];
?>
<!doctype html>
<html>
<head> 

</head>
<body>
	<h1">Dashboard</h1>
	<div>
		<img src='<?php echo $avatar;?>' class="rounded-full w-12 h-12 mr-3"/>
		<?php echo $username;?>
	</div>
	<a href="logout.php">Logout</a>
</body>
</html>