<?php
	session_start();
	require 'back/userdbconn.php';


	$pwd=$_REQUEST['password'];
	$uname=$_REQUEST['username'];
	$email=$_REQUEST['email'];

	/*$sql="select max(id) as cnt from user";
	$results=mysqli_query($con,$sql);   //To execute query
	$row=mysqli_fetch_assoc($results);*/
	
	$sql='INSERT INTO user(username,password,email) VALUES ("'.$uname.'","'.$pwd.'","'.$email.'")';
	$results=mysqli_query($con,$sql);   //To execute query
	
	if($results==true){
		$_SESSION['msg']="Successfully Registered!";
		header('location:login.php');	
	}

?>