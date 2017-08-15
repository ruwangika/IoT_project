<?php

    require 'dbconn.php';
    require 'mongo_access.php';
    require 'circularArray.php';

    $errorlogfile = "../test/errorlog.txt";

    function getDeviceData($con,$deviceID,$channelID,$xAxis,$startDate,$endDate,$accInt){//line chart data
       // echo "test";
        $accInt=intval($accInt)*60;
        global $errorlogfile;
        //$sql = 'SELECT '.$xAxis.','.$channelID.' FROM powerpro WHERE code=? AND date_time BETWEEN ? AND ?';
        $sql = 'SELECT  floor((UNIX_TIMESTAMP(date_time) - UNIX_TIMESTAMP(?))/(?)) as  t, '.$xAxis.', AVG('.$channelID.') FROM powerpro WHERE code=? AND date_time BETWEEN ? AND ? GROUP BY t';
        $counter = 0;
        if ($stmt = mysqli_prepare($con, $sql)) {
            mysqli_stmt_bind_param($stmt,"siiss",$startDate,$accInt,$deviceID,$startDate,$endDate);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_bind_result($stmt,$tValue, $xValue, $yValue);
            
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

    function getDeviceSDCounters($con,$deviceID,$startDate,$endDate,$accInt,$duration=null){
        $rest=" ";
        if($duration!==null)
            $rest=" and time(date_time) between '$duration[0]' and '$duration[1]' ";
        $accInt= strtolower($accInt);
        if ($accInt==="hour"){
            $accInt='year(date_time),month(date_time),day(date_time),hour';
            $sql =  'SELECT MIN(sdCounter),MAX(sdCounter) FROM powerpro WHERE code=? AND date_time BETWEEN ? AND ?'.$rest.'GROUP BY '.$accInt.'(date_time)';

        }
        elseif ($accInt==="day"){
            $accInt='year(date_time),month(date_time),day';
            $sql =  'SELECT MIN(sdCounter),MAX(sdCounter) FROM powerpro WHERE code=? AND date_time BETWEEN ? AND ?'.$rest.'GROUP BY '.$accInt.'(date_time)';
        }
        elseif ($accInt==="month"){
            $accInt='year(date_time),month';
            $sql =  'SELECT MIN(sdCounter),MAX(sdCounter) FROM powerpro WHERE code=? AND date_time BETWEEN ? AND ?'.$rest.'GROUP BY '.$accInt.'(date_time)';
        }
        elseif ($accInt==="year"){
            $accInt='year';
            $sql =  'SELECT MIN(sdCounter),MAX(sdCounter) FROM powerpro WHERE code=? AND date_time BETWEEN ? AND ?'.$rest.'GROUP BY '.$accInt.'(date_time)';
        }
        elseif($accInt==="pie")
            $sql =  'SELECT MIN(sdCounter),MAX(sdCounter) FROM powerpro WHERE code=? AND date_time BETWEEN ? AND ?';
        else
            return $accInt;
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



///////////////////////////////////////////////////////////////////////////Start chart data load calls/////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function getBarChartData($deviceIDs,$channelIDs,$xAxis,$startDate,$endDate,$accInt,$tarrifs){
        $con = getConnection();  
        $d_len = count($deviceIDs);
        for ($d_i=0; $d_i <  $d_len; $d_i++) { 
            $deviceID = $deviceIDs[$d_i];
            $channelID = $channelIDs[$d_i];
            $needle='M';
            if (strpos($deviceID,$needle)===0){////toto need to be changed into mongo//////////////////////////////////////////////////////////////////
                    
                    $db=getMongoDB($deviceID);
                    $ar=getBarChartDataOnDevice($db,$deviceID,$channelID,$xAxis,$startDate,$endDate,$accInt); 
                    $data[$deviceID][$channelID] = $ar[1];
                    $data[$deviceID][$xAxis] = $ar[0];
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            else{
                $sdCounters = getDeviceSDCounters($con,$deviceID,$startDate,$endDate,$accInt);
                $_len = count($sdCounters);
                for ($i=0; $i <  $_len; $i++) { 
                    //print_r($sdCounters[$i]);
                    $ar = getDeviceAccData($con,$deviceID,$channelID,$xAxis,$sdCounters[$i][1],$sdCounters[$i][0]);
                    $data[$deviceID][$channelID][$i] = $ar[1];
                    $data[$deviceID][$xAxis][$i] = $ar[0];
                }
            }
        }
        closeConnection($con);
        $rs=formatData($data,$accInt);
        //var_dump($rs);
        return $rs;
    }

function getMaxSampInterval($deviceIds) {
    //Find the max sampling interval of the devices from db
    return 1;
}

//Return desired sample rate
    function getSampleRate($ids,$startDate,$endDate){
        $n = 1000; //No. of points for a graph - constant
        $maxInt = getMaxSampInterval($ids);
        $timediff = strtotime($endDate) - strtotime($startDate);
        $noOfPoints = $timediff / ($maxInt*60);
        if ($noOfPoints <= $n) {
            return $maxInt;
        }
        else {
            return $noOfPoints / $n;
        }
    }

    function getLineChartData ($deviceIDs,$channelIDs,$xAxis,$startDate,$endDate){
    // DeviceIDs = [device1,device2....]
    // ChannelIDs = [channel1,channel2....]
    // Return data 
        $samplingInterval=getSampleRate($deviceIDs,$startDate,$endDate);

        $con = getConnection();
        $counter = 0;
        for ($i=0; $i < count($deviceIDs); $i++) { 
            
            $deviceID = $deviceIDs[$i];
            $channelID = $channelIDs[$i];
            $needle='M';
            if (strpos($deviceID,$needle)===0){////toto need to be changed into mongo//////////////////////////////////////////////////////////////////
                
                $db=getMongoDB($deviceID);
                $deviceData = getLineChartDataOnDevice($db,$deviceID,$channelID,$xAxis,$startDate,$endDate,$samplingInterval);
                $data[$deviceID][$channelID] = $deviceData[1];
                $data[$deviceID][$xAxis] = $deviceData[0];
            }/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            else{
                $deviceData = getDeviceData($con,$deviceID,$channelID,$xAxis,$startDate,$endDate,$samplingInterval);
                $data[$deviceID][$channelID] = $deviceData[$deviceID][$channelID];
                $data[$deviceID][$xAxis] = $deviceData[$deviceID][$xAxis];
            }
        }
        closeConnection($con);
        $rs=formatData($data,$samplingInterval);
        return $rs;
    }

    
    function getPieChartData($deviceIDs,$channelIDs,$startDate,$endDate,$dataType)
      {
          
        $accInt="pie";
        $xAxis='date_time';
        $con = getConnection();  
        $d_len = count($deviceIDs);
        for ($d_i=0; $d_i <  $d_len; $d_i++) { 
            $deviceID = $deviceIDs[$d_i];
            $channelID = $channelIDs[$d_i];
            $needle='M';
            if (strpos($deviceID,$needle)===0){////toto need to be changed into mongo//////////////////////////////////////////////////////////////////
                    
                    $db=getMongoDB($deviceID);
                    $ar=getBarChartDataOnDevice($db,$deviceID,$channelID,$xAxis,$startDate,$endDate,$accInt); 
                    $data[$deviceID][$channelID] = $ar[1];
                    $data[$deviceID][$xAxis] = $ar[0];
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            else{
                $sdCounters = getDeviceSDCounters($con,$deviceID,$startDate,$endDate,$accInt);
                $_len = count($sdCounters);
                for ($i=0; $i <  $_len; $i++) { 
                    //print_r($sdCounters[$i]);
                    $ar = getDeviceAccData($con,$deviceID,$channelID,$xAxis,$sdCounters[$i][1],$sdCounters[$i][0]);
                    $data[$deviceID][$channelID][$i] = $ar[1];
                    $data[$deviceID][$xAxis][$i] = $ar[0];
                }
            }
        }
        closeConnection($con);
        return $data;
      }
///////////////////////////////////////////////////////////////////////////End calling calls graph data//////////////////////////////////////////////////////////////////////////////////////////////////////////





    function getEproDeviceList($user_id){
        if($user_id==='1'){
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
        else{
            $con_iot=getIoTDeviceDataConnection();
            $iot_querry= "SELECT epro_userid FROM user where id=".$user_id;// epro_userid=pid in c_epro_5000.userdata
            $iot_results = mysqli_query($con_iot,$iot_querry);
            $row=mysqli_fetch_assoc($iot_results);
            
            closeConnection($con_iot);
            if($row["epro_userid"]===NULL){
                return "Null Data";
            }
            
            $con = getConnection();
            $sql = "SELECT device.DeviceId,device.DeviceName FROM userdata_device RIGHT JOIN device ON userdata_device.device_id=device.pid where userdata_device.userdata_id=".$row["epro_userid"];
            $results = mysqli_query($con,$sql);
            $nor = mysqli_num_rows($results);
            $counter = 0;
            if($nor !== 0){
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



    function getCustomDeviceList($user_id){
        if($user_id==='1'){
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
        else{
            $con=getIoTDeviceDataConnection();
            $query="select user_defined_device_id,device_id from user_device where user_id=".$user_id;
            $results=mysqli_query($con,$query);//To execute query
            $nor = mysqli_num_rows($results);
            $counter = 0;
            if($nor > 0){
                while ($row=mysqli_fetch_assoc($results)) {
                    $data["DeviceName"][$counter] = $row["user_defined_device_id"]; 
                    $data["DeviceId"][$counter++] = $row["device_id"]; 
                }
                closeConnection($con);
                return $data;
            }else{
                closeConnection($con);
                return "Null Data";
            }
        }
    }
    function registerDevice($user_id,$user_device_id,$device_id){

        $con=getIoTDeviceDataConnection();
        $check_query="select count(*) as count from user_device where user_id='$user_id'";
        $results=mysqli_query($con,$check_query);
        $row=mysqli_fetch_assoc($results);
        if($row["count"]<5){//////////////////////////////////////////////////////////////////////////////////////////////////count for maximum user device condition for free account////////////////
            $query="INSERT INTO device(Name,Host,Port,Location,ID) VALUES ('$user_device_id','localhost',27017,'Sri Lanka','$device_id')";
            $results=mysqli_query($con,$query);//To execute query
            //$row=mysqli_fetch_assoc($results);
            $query="INSERT INTO user_device(user_id,user_defined_device_id,device_id) VALUES ('$user_id','$user_device_id','$device_id')";
            $results=mysqli_query($con,$query);//To execute query
            closeConnection($con);
            return $results;
        }else{ 
            closeConnection($con);
            return NULL;}
    }

    function removeDevice($device_id){

        $con=getIoTDeviceDataConnection();
       // $row=mysqli_fetch_assoc($results);
        $query="DELETE FROM user_device WHERE device_id='$device_id'";
        $results=mysqli_query($con,$query);//To execute query
        
        $query="DELETE FROM device WHERE ID='$device_id'";
        $results=mysqli_query($con,$query);//To execute query
        closeConnection($con);
        return $results;

    }
    
    function getCustomUserDeviceList($user_id){
        $con=getIoTDeviceDataConnection();
        $query="select user_defined_device_id,device_id from user_device where user_id=".$user_id;
        $results=mysqli_query($con,$query);//To execute query
        $nor = mysqli_num_rows($results);
        $counter = 0;
        if($nor > 0){
            while ($row=mysqli_fetch_assoc($results)) {
                $data["DeviceName"][$counter] = $row["user_defined_device_id"]; 
                $data["DeviceId"][$counter++] = substr($row["device_id"], 1);
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
        $db = getMongoDB($id);
        $collections=$db->getCollectionNames();
        $count=0;
        foreach ($collections as $collection) {
                $data["Channel"][$count] = $collection;
                $count++;
        }
        return $data;
    }

//////////////////////////////////////////////////////////////data formatting/////////////////////////////////////////////////////////
    function formatData($data,$accInt){
	//var_dump($data);

        if($data==NULL){
            return NULL;
	}

        $queue=new circularArray();
        $queue->init($data);
        $minLengthArray=getShortest($data);
        foreach($data as $key=>$value){
            $targetSet[$key]=1;
        }

        $count=0;
	$result=array();

        foreach($minLengthArray as $time){
	    try{
            $rs=cicularFind($time,$data,$queue,$targetSet,$accInt);
	    }catch(Exception $e) {
		continue;
	    }
            if($rs!==NULL){

                foreach($rs as $deviceID=>$dataSet){
                    foreach($dataSet as $key=>$value){
                        $result[$deviceID][$key][$count]=$value;

                    }
                }

                $count++;

            }

        }

        return $result;



    }
    function getShortest($data){
        $minLength=0;
        $minLengthArray=NULL;
        foreach($data as $key=>$value){
            $count=count($data[$key]["date_time"]);
            if($count<$minLength)
                $minLength=$count;
                $minLengthArray=$data[$key]["date_time"];
        }
        return $minLengthArray;

    }
    function cicularFind($time,$data,$queue,$targetSet,$accInt){
        
        $discoveredSet=array();
        $rs=array();

        while(TRUE){
            $top=&$queue->getFirst();
            $device=$data[$top["key"]];

            if($discoveredSet==$targetSet)
                return $rs;
            $t1=format($time,$accInt);
            $t2=format($device["date_time"][$top["count"]],$accInt);
            if($t1>$t2){
                $top["count"]++;
            }
            elseif($t1==$t2){
                foreach($device as $channelName=>$chanelArray){
                    $rs[$top["key"]][$channelName]=$chanelArray[$top["count"]];
                    //var_dump($rs);
                }
                $rs[$top["key"]]["date_time"]=$t1->format('Y-m-d H:i:s');;
                $top["count"]++;
                $queue->pushBack();
                $discoveredSet[$top["key"]]=1;
            }else{
                return NULL;
            }

        }

    }
    function format($time,$accInt){
        $len=strlen($time);
        if($accInt==="HOUR"){
            //substr_replace($time,"00",$len-2,$len-2);
            $time[$len-2]="0";
            $time[$len-1]="0";

            $time[$len-4]="0";
            $time[$len-5]="0";
        }elseif($accInt==="DAY"){
            $time[$len-2]="0";
            $time[$len-1]="0";

            $time[$len-4]="0";
            $time[$len-5]="0";

            $time[$len-7]="0";
            $time[$len-8]="0";

        }elseif($accInt==="MONTH"){
            $time[$len-2]="0";
            $time[$len-1]="0";

            $time[$len-4]="0";
            $time[$len-5]="0";

            $time[$len-7]="0";
            $time[$len-8]="0";

            $time[$len-10]="0";
            $time[$len-11]="0";


        }elseif($accInt==="YEAR"){
            $time[$len-2]="0";
            $time[$len-1]="0";//seconds

            $time[$len-4]="0";
            $time[$len-5]="0";//minutes

            $time[$len-7]="0";
            $time[$len-8]="0";//hours

            $time[$len-10]="0";
            $time[$len-11]="0";//days

            $time[$len-13]="0";
            $time[$len-14]="0";//months

        }elseif($accInt<60){

            $time[$len-2]="0";
            $time[$len-1]="0";//seconds

        }
        elseif($accInt>60 && $accInt<1440){
            $time[$len-2]="0";
            $time[$len-1]="0";//seconds

            $time[$len-4]="0";
            $time[$len-5]="0";//minutes
        }
        elseif($accInt>1440){
            $time[$len-2]="0";
            $time[$len-1]="0";//seconds

            $time[$len-4]="0";
            $time[$len-5]="0";//minutes

            $time[$len-7]="0";
            $time[$len-8]="0";//hours
        }
        $time=new DateTime($time);
        return $time;
    }
    function getStackedBarChartData($deviceIDs,$channelIDs,$xAxis,$startDate,$endDate,$accInt,$tarrifs){
        $con = getConnection();  
        $d_len = count($deviceIDs);
        $start=$tarrifs[0];
        for($i=1;$i<count($tarrifs);$i++){
            $end=$tarrifs[$i];
            for ($d_i=0; $d_i <  $d_len; $d_i++) { 
                $deviceID = $deviceIDs[$d_i];
                $channelID = $channelIDs[$d_i];
                $needle='M';
                if (strpos($deviceID,$needle)===0){////toto need to be changed into mongo//////////////////////////////////////////////////////////////////
                        
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                else{
                    $sdCounters = getDeviceSDCounters($con,$deviceID,$startDate,$endDate,$accInt,[$start,$end]);
                    $_len = count($sdCounters);
                    for ($i=0; $i <  $_len; $i++) { 
                        //print_r($sdCounters[$i]);
                        $ar = getDeviceAccData($con,$deviceID,$channelID,$xAxis,$sdCounters[$i][1],$sdCounters[$i][0]);
                        $data[$deviceID][$channelID][$i] = $ar[1];
                        $data[$deviceID][$xAxis][$i] = $ar[0];
                    }
                }
            }
            $rs[$start."-".$end]=formatData($data,$accInt);
            $start=$end;
        }
        closeConnection($con);
        return $rs;
    }

//// Chat
    function getChatReply($msg) {
        // To do        

        $replyMsg = "Sorry, we are still on testing stage.";
        // $con = getConnection();
        // $query = "SELECT reply_msg FROM chat_tab WHERE msg = LOWER('" . $msg . "')";
        // $results = mysqli_query($con,$query);
        // $nor = mysqli_num_rows($results);
        // $counter = 0;
        // if($nor > 0){
        //     while ($row = mysqli_fetch_assoc($results)) {
        //         $replyMsg = $row["reply_msg"];
        //     }
        //     closeConnection($con);
        // }
        return $replyMsg;
    }

    
?> 


