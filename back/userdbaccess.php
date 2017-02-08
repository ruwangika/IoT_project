<?php

	require 'userdbconn.php';

	function getUserList(){
        global $con;
        $sql = "SELECT id,username FROM user";
        $results = mysqli_query($con,$sql);

        $nor = mysqli_num_rows($results);
        $counter = 0;
        if($nor != 0){
            while ($row=mysqli_fetch_assoc($results)) {
                $data["id"][$counter] = $row["id"]; 
                $data["username"][$counter++] = $row["username"]; 
            }
            return $data;
        }else{
            return "Null Data";
        }
        
    }

?>