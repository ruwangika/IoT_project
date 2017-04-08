<?php

	$conn=new MongoClient("mongodb://localhost:27017");
	function getConnection(){
		$con=mysqli_connect("localhost","dileep","dileep@123","c_epro_5000"); //connection string
		if ($con->connect_error) {
	    	die("Connection failed: " . $con->connect_error);
		}else{
			return $con;
		}
	}

	function closeConnection($con){
		mysqli_close($con);
	}
	function getIoTDeviceDataConnection(){
		$con=mysqli_connect("localhost","dileep","dileep@123","IOT"); 
		if ($con->connect_error) {
	    	die("Connection failed: " . $con->connect_error);
		}else{
			return $con;
		}
	}
	function getMongoDB($id)
	{
		$db=$GLOBALS['conn']->selectDB($id);
		return $db;
	}
	
		
	
?>
