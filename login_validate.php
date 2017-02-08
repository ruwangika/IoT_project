<?php
	session_start();
	require 'back/userdbconn.php';


	$pwd=md5($_REQUEST['password']);
	$uname=$_REQUEST['username'];

	$sql="select id from user where username='$uname' and password='$pwd'";
	$results=mysqli_query($con,$sql);   //To execute query
	$row=mysqli_fetch_assoc($results);

	if($row['id']!=0){
		$_SESSION["id"] = $row['id'];
		header('location:index.php');
		
	}else{
		$_SESSION['msg']="Wrong username or password!";
		header('location:login.php');
	}
?>