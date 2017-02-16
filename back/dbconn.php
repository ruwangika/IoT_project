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

	function getMongoConnection($id){
		$con=mysqli_connect("localhost","dileep","dileep@123","IOT"); 
		if ($con->connect_error) {
	    	die("Connection failed: " . $con->connect_error);
			return null;
		}
		$query="select Host,Port from device where ID=$id";
        $results=mysqli_query($con,$query);//To execute query
		if($row=mysqli_fetch_assoc($results)){
			$host=$row["Host"];
			$port=$row["Port"];
			$mongo=new MongoClient( "mongodb://$host:$port/$id" ); 
			closeConnection($con);
			return $mongo;
		}
       
	}
		
	
?>
