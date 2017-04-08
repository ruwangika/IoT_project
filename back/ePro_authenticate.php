<?php
    require 'dbconn.php';
    
    $type=$_POST['type'];
    $id=$_POST["id"];

    if($type==='stat'){
          
        $iot_con=getIoTDeviceDataConnection();
        $iot_query="SELECT epro_username from user where id = $id";
        $results = mysqli_query($iot_con,$iot_query);
        while($row=mysqli_fetch_assoc($results)){
            echo $row["epro_username"];
            closeConnection($iot_con);
        }
        
        
        
    }
    elseif($type==='link'){

        $pwd = $_POST["pwd"];
        $username=$_POST["username"];

        $con=getConnection();
        $query="select pid,AES_DECRYPT(passWord,'enet') as password from userdata where userName='$username'";
        $results = mysqli_query($con,$query);
        $nor = mysqli_num_rows($results);
        $pid=NULL;

        if($nor===0){
            echo "Invalid login!";
            closeConnection($con);
        }

        else{
            while ($row=mysqli_fetch_assoc($results)) 
                if($pwd===$row["password"]){
                    $pid=$row["pid"];
                    break;
                }

            if($pid===NULL){
                echo "Invalid login!";
                closeConnection($con);
            }else{
                $iot_con=getIoTDeviceDataConnection();
                $iot_query="UPDATE user SET epro_userid = '$pid', epro_username='$username' where id = $id";
                $results = mysqli_query($iot_con,$iot_query);
                closeConnection($iot_con);
                closeConnection($con);
                echo $username;
            }
        }

    }
    else if($type==='remove'){
        
        $iot_con=getIoTDeviceDataConnection();
        $iot_query="UPDATE user SET epro_userid = NULL where id = $id";
        $results = mysqli_query($iot_con,$iot_query);
        closeConnection($iot_con);
        echo "success!";

    }
    
?>