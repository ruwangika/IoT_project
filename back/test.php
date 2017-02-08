<?php
    
    require 'dbconn.php';

    $code = '1131';
    $yAxes = ['ph1_active_energy', 'ph2_active_energy', 'ph3_active_energy'];
    $xAxis = 'date_time';
    $startDate = '2016-10-26';
    $endDate = '2016-11-02';
    $accInt = 1*24*3600 ; // "0-0-1 00:00";
    $tarrifs = [["0-0-0 00:00","0-0-0 12:00"]];

    $devices = [1037,1092,1038];
    $channel = "ph1_active_energy";
    
    $file = "../test/userdata.json";
?>
<html>
    <head>
        
    </head>
    <body>

<?php 
    
    //print_r(getDeviceSDCountersTest($code,$startDate,$endDate,3600));
    echo "A";
    $sql = "select ph1_current,sdCounter from powerpro where code='1131' AND sdCounter=239605";
    echo "A";
    getSQLQuery($sql,"ph1_current","ph2_current");
    echo "A";
?>
    
    </body>
</html>


<?php
    

    function getSQLQuery($sql,$col1,$col2){
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo $col1." : " . $row[$col1]. " - ".$col2." : " . $row[$col2]. "<br>";
            }
        } else {
            echo "0 results";
        }
    }

    function getDeviceSDCountersTest($deviceID,$startDate,$endDate,$accInt){

        global $con;
        $sql =  'SELECT MIN(date_time),MAX(date_time) FROM powerpro WHERE code=? AND date_time BETWEEN ? AND ?  GROUP BY '.$accInt.'(date_time)' ;
        echo $sql."<br>";
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

    function getDeviceDataTest($deviceID,$startDate,$endDate){
        global $con;
        $sql =  'SELECT sdCounter,date_time FROM powerpro WHERE code=? AND date_time BETWEEN ? AND ? ';
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


?>