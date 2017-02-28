<?php

    function getBarChartDataOnDevice($mysql_conn,$deviceID,$channelID,$xAxis,$startDate,$endDate,$accInt) {
        $query='select Host,Port from device where ID="'.$deviceID.'"';
        $results=mysqli_query($mysql_conn,$query);//To execute query
		$nor = mysqli_num_rows($results);
		while($row=mysqli_fetch_assoc($results)){
			$data=array($row["Host"],$row["Port"],$deviceID);
			closeConnection($mysql_conn);
		}
        $db=getMongoDB($data[0],$data[1],$deviceID);
        $collection=$db[$channelID];
        $accInt= strtolower($accInt);
        $deltaT=0;
        $start = new DateTime($startDate);// "YYYY-MM-DD HH:MM:SS"
        $end = new DateTime($endDate);
        $interval_string='P0Y0M0DT0H0M0S';
        if ($accInt==='hour'){
            $interval_string='P0Y0M0DT1H0M0S';
        }
        elseif($accInt==='day'){
            $interval_string='P0Y0M1DT0H0M0S';
        }
        elseif($accInt==='week'){
            $interval_string='P0Y0M7DT0H0M0S';
        }
        elseif($accInt==='month'){
            $interval_string='P0Y1M0DT0H0M0S';
        }
      /*  for(;$start<$end;){
            $chucnkMarging=$start->add(new DateInterval($interval_string));
            
        }
*/
    }

    function getLineChartDataOnDevice($mysql_conn,$deviceID,$channelID,$xAxis,$startDate,$endDate,$d_f_sample_average_Rate){

    }



?>