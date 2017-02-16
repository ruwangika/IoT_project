<?php

    require 'dbconn.php';

    $errorlogfile = "../test/errorlog.txt";

    function getDeviceData($con,$deviceID,$channelID,$xAxis,$startDate,$endDate,$accInt=1){

        global $errorlogfile;
        $sql =  'SELECT '.$xAxis.','.$channelID.' FROM powerpro WHERE code=? AND date_time BETWEEN ? AND ?';
        $counter = 0;
        if ($stmt = mysqli_prepare($con, $sql)) {
            mysqli_stmt_bind_param($stmt,"iss",$deviceID,$startDate,$endDate);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_bind_result($stmt, $xValue, $yValue);
            
            while(mysqli_stmt_fetch($stmt)) {
                $data[$deviceID][$channelID][$counter] = $yValue;
                $data[$deviceID][$xAxis][$counter++] = $xValue;
            }
            mysqli_stmt_close($stmt);
        }
        if($counter == 0){
            $error["query"] = $sql;
            $error["param"] = [$deviceID,$startDate,$endDate];
            file_put_contents($errorlogfile, json_encode($error,TRUE));
            return null;
        }
        return $data;
    }

    function getDeviceSDCounters($con,$deviceID,$startDate,$endDate,$accInt){

        $sql =  'SELECT MIN(sdCounter),MAX(sdCounter) FROM powerpro WHERE code=? AND date_time BETWEEN ? AND ?  GROUP BY '.$accInt.'(date_time)';
        if ($stmt = mysqli_prepare($con, $sql)) {
            mysqli_stmt_bind_param($stmt,"iss",$deviceID,$startDate,$endDate);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_bind_result($stmt, $min, $max);
            $counter = 0; 
            $data = [];
            while(mysqli_stmt_fetch($stmt)) {
                $data[$counter++] = [$min,$max];     
            }
            return $data;
            mysqli_stmt_close($stmt);
        }
        return [];
    }

    function getSdCounterData($con,$deviceID,$channelID,$xAxis,$sdCounter){
        $sql = 'SELECT '.$channelID.','.$xAxis.' FROM powerpro WHERE code=? AND sdCounter =?';
        if($stmt = mysqli_prepare($con, $sql)){
            mysqli_stmt_bind_param($stmt,"is",$deviceID,$sdCounter);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_bind_result($stmt, $value, $timestamp);
            if (mysqli_stmt_fetch($stmt)) {
                mysqli_stmt_close($stmt);
                return [$timestamp,$value];
            }
            mysqli_stmt_close($stmt);  
        }
    }

    function getDeviceAccData($con,$deviceID,$channelID,$xAxis,$max_sdcounter,$min_sdcounter){
        $ar = getSdCounterData($con,$deviceID,$channelID,$xAxis,$max_sdcounter);
        $temp = $ar[1];
        $ar = getSdCounterData($con,$deviceID,$channelID,$xAxis,$min_sdcounter);
        return [$ar[0],$temp - $ar[1]];
    }

    function getBarChartData($deviceIDs,$channelIDs,$xAxis,$startDate,$endDate,$accInt,$tarrifs){
        $con = getConnection();
        $d_len = count($deviceIDs);
        for ($d_i=0; $d_i <  $d_len; $d_i++) { 
            $deviceID = $deviceIDs[$d_i];
            $channelID = $channelIDs[$d_i];
            $sdCounters = getDeviceSDCounters($con,$deviceID,$startDate,$endDate,$accInt);
            $_len = count($sdCounters);
            for ($i=0; $i <  $_len; $i++) { 
                //print_r($sdCounters[$i]);
                $ar = getDeviceAccData($con,$deviceID,$channelID,$xAxis,$sdCounters[$i][1],$sdCounters[$i][0]);
                $data[$deviceID][$channelID][$i] = $ar[1];
                $data[$deviceID][$xAxis][$i] = $ar[0];
            }
        }
        closeConnection($con);
        return $data;
    }

    function getLineChartData ($deviceIDs,$channelIDs,$xAxis,$startDate,$endDate,$samplingRatio=1){
    // DeviceIDs = [device1,device2....]
    // ChannelIDs = [channel1,channel2....]
    // Return data 
        $con = getConnection();
        $counter = 0;
        for ($i=0; $i < count($deviceIDs); $i++) { 
            
            $deviceID = $deviceIDs[$i];
            $channelID = $channelIDs[$i];

            $deviceData = getDeviceData($con,$deviceID,$channelID,$xAxis,$startDate,$endDate,$samplingRatio);

            $data[$deviceID][$channelID] = $deviceData[$deviceID][$channelID];
            $data[$deviceID][$xAxis] = $deviceData[$deviceID][$xAxis];
        }
        closeConnection($con);
        return $data;
    }

    
    function getPieChartData($devices,$channel,$startDate,$endDate,$dataType){
        $con = getConnection();
        $counter = count($devices);
        $sql =  'SELECT MIN(sdCounter),MAX(sdCounter) FROM powerpro WHERE code=? AND date_time BETWEEN ? AND ?';
        for($i = 0; $i < $counter ; $i++){
            $device = $devices[$i];
            $data[$device]["DeviceName"] = getDeviceName($device);

            if ($stmt = mysqli_prepare($con, $sql)) {

                mysqli_stmt_bind_param($stmt,"iss",$device,$startDate,$endDate);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_bind_result($stmt, $max_sdcounter, $min_sdcounter);
                if (mysqli_stmt_fetch($stmt)) {
                    mysqli_stmt_reset($stmt);
                    $sql2 = 'SELECT '.$channel.' FROM powerpro WHERE code=? AND sdCounter IN (?,?)';
                    if($stmt2 = mysqli_prepare($con, $sql2)){
                        mysqli_stmt_bind_param($stmt2,"iss",$devices[$i],$max_sdcounter,$min_sdcounter);
                        mysqli_stmt_execute($stmt2);
                        mysqli_stmt_bind_result($stmt2, $value);
                        if (mysqli_stmt_fetch($stmt2)) {
                            
                            $temp =  $value;
                            if (mysqli_stmt_fetch($stmt2)) {
                                $data[$device][$channel] = $value - $temp;     
                            }
                        }
                        mysqli_stmt_close($stmt2);  
                    }                    
                }
                mysqli_stmt_close($stmt);
            }
        }
        closeConnection($con);
        return $data;
    }




    function getEproDeviceList(){
        $con = getConnection();
        $sql = "SELECT DeviceId,DeviceName FROM device";
        $results = mysqli_query($con,$sql);

        $nor = mysqli_num_rows($results);
        $counter = 0;
        if($nor != 0){
            while ($row=mysqli_fetch_assoc($results)) {
                $data["DeviceName"][$counter] = $row["DeviceName"]; 
                $data["DeviceId"][$counter++] = $row["DeviceId"]; 
            }
            closeConnection($con);
            return $data;
        }else{
            closeConnection($con);
            return "Null Data";
        }
        
    }

    function getEProChannelList(){
        $con = getConnection();
        $sql = "SHOW columns FROM powerpro";
        $results = mysqli_query($con,$sql);
        $nor = mysqli_num_rows($results);
        if($nor != 0){
            // To remove unwanted data
            for ($i=0; $i < 4; $i++) { 
                $row=mysqli_fetch_assoc($results);
            }
            $counter = 0;
            while ($row=mysqli_fetch_assoc($results)) {
                $data["Channel"][$counter++] = $row["Field"]; 
            }
            closeConnection($con);
            return $data;
        }   
    }

    function getDeviceName($deviceID){
        $con = getConnection();

        $sql = "SELECT DeviceName FROM device WHERE DeviceId='".$deviceID."'";
        $results=mysqli_query($con,$sql);//To execute query
        $nor=mysqli_num_rows($results);// to count no of records
        if($nor != 0){
            if ($row=mysqli_fetch_assoc($results)) {
                closeConnection($con);
                return $row["DeviceName"]; 
            }
        }else{
            closeConnection($con);
            return "Null Device";
        }
            
    }



    function getCustomDeviceList(){
        $con=getIoTDeviceDataConnection();
        $query="select ID,Name from device";
        $results=mysqli_query($con,$query);//To execute query

        $nor = mysqli_num_rows($results);
        $counter = 0;
        if($nor > 0){
            while ($row=mysqli_fetch_assoc($results)) {
                $data["DeviceName"][$counter] = $row["Name"]; 
                $data["DeviceId"][$counter++] = $row["ID"]; 
            }
            closeConnection($con);
            return $data;
        }else{
            closeConnection($con);
            return "Null Data";
        }
    }

    function getDeviceTypes(){
        $con=getIoTDeviceDataConnection();
        $query="select distinct(Type) from device_columns";
        $results=mysqli_query($con,$query);//To execute query

        $nor = mysqli_num_rows($results);
        $counter = 0;
        if($nor > 0){
            while ($row=mysqli_fetch_assoc($results)) {
                $data["Type"][$counter++] = $row["Type"]; 
            }
            $data["Type"][$counter++] = "Custom";
            closeConnection($con);
            return $data;
        }else{
            closeConnection($con);
            return "Null Data";
        }
    }
    
    function getCustomDeviceChennels($id){
        $data=null;
        $con=getMongoConnection($id);
        $result=$con->listCollections();
        foreach ($result as $collection) {
             $data["Channel"][$counter++] = $collection; 
        }
        return $data;
    }
?> 