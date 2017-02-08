<?php

//to create database connection

	$con=mysqli_connect("localhost","dileep","dileep@123","userdb"); //connection string

	if ($con->connect_error) {

	    die("Connection failed: " . $con->connect_error);

	}

?>