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

		
	
?>
