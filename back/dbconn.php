<?php


	function getConnection(){
		$con=mysqli_connect("localhost","Thimal","Th1m@l123","c_epro_5000"); //connection string
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
	function getMongoDB($Host="development.enetlk.com",$Port=27017,$id)
	{
		$conn=new MongoClient("mongodb://$Host:$Port");
		$db=$conn->selectDB($id);
		return $db;
	}
	
		
	
?>
