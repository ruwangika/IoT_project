<?php

    function getBarChartDataOnDevice($mongo_db,$deviceID,$channelID_with_prefix,$xAxis,$startDate,$endDate,$accInt) {
        $pieces = explode("*", $channelID_with_prefix);
        $channelID=$pieces[1];
        $prefix=floatval($pieces[0]);
        $collection=$mongo_db->selectCollection($channelID);
        $accInt= strtolower($accInt);

        $temp=explode(" ",$startDate);
        $startDate=$temp[0];

        $start = new DateTime($startDate,new DateTimeZone("UTC"));// "YYYY-MM-DD HH:MM:SS"
        $end = new DateTime($endDate,new DateTimeZone("UTC"));
        $start_mongo=new MongoDate($start->format('U'));
        $end_mongo=new MongoDate($end->format('U'));
        $cursor = $collection->find(array("_id" => array('$gte' => $start_mongo, '$lt' => $end_mongo)));
        $data=iterator_to_array($cursor);//data buffer

        $interval_string='P0Y0M0DT0H0M0S';
        
        if ($accInt==='hour'){
            $interval_string='P0Y0M1DT0H0M0S';
            $data_count=0;
            while($start<$end){

                $key="0.00000000 ".$start->format('U');
                $doc=$data[$key];

                if ( $doc!==NULL) {
                    for($i=0;$i<24;$i++){
                        $hour_data=$doc["data"][$i];
                        $point_start=0;
                        $point_end=0;
                        if($hour_data!==NULL){

                            for($j=0;$j<60;$j++){ ///point at the start......
                                $temp_point=$hour_data[$j];
                                if($temp_point!==NULL){
                                    $point_start=$temp_point;
                                    break;
                                }
                            }

                            for($j=59;$j>=0;$j--){ ///point at the end......
                                $temp_point=$hour_data[$j];
                                if($temp_point!==NULL){
                                    $point_end=$temp_point;
                                    break;
                                }
                            }

                        }
                        $hour=$start->format('Y-m-d')." ".strval($i).":00:00";//result on this hour
                        $data_point=($point_end-$point_start)*$prefix;
                        $results[0][$data_count]=$hour;
                        $results[1][$data_count++]=$data_point;
                    }
                    
                }
                $start->add(new DateInterval($interval_string));
            }
            return $results;
        }

        elseif($accInt==='day'){
            $interval_string='P0Y0M1DT0H0M0S';
            $data_count=0;
            while($start<$end){

                $key="0.00000000 ".$start->format('U');
                $doc=$data[$key];

                if($doc!==NULL) {
                    $point_start=NULL;
                    $point_end=NULL;
                    for($i=0;$i<24;$i++){//serching from start
                        $hour_data=$doc["data"][$i];
                        if($hour_data!==NULL){

                            for($j=0;$j<60;$j++){ ///point at the start......
                                $temp_point=$hour_data[$j];
                                if($temp_point!==NULL){
                                    $point_start=$temp_point;
                                    break;
                                }
                            }

                        }
                        if( $point_start!==NULL){
                            break;
                        }
                       
                    }

                    for($i=23;$i>=0;$i--){//serching from end
                        $hour_data=$doc["data"][$i];
                        if($hour_data!==NULL){

                            for($j=59;$j>=0;$j--){ ///point at the end......
                                $temp_point=$hour_data[$j];
                                if($temp_point!==NULL){
                                    $point_end=$temp_point;
                                    break;
                                }
                            }

                        }
                        if( $point_end!==NULL){
                            break;
                        }
                       
                    }
                    $day=$start->format('Y-m-d');//result on this hour
                    $data_point=($point_end-$point_start)*$prefix;
                    $results[0][$data_count]=$day;
                    $results[1][$data_count++]=$data_point;
                }

                $start->add(new DateInterval($interval_string));
            }
            return $results;
        }
        elseif($accInt==='month'||$accInt==='week'){

            if($accInt==='month')
                $interval_string='P0Y1M0DT0H0M0S';
            else
                $interval_string='P0Y0M7DT0H0M0S';

            $data_count=0;

            while($start<$end){

                $point_start=NULL;
                $point_end=NULL;
                $last_doc=NULL;

                $docs=[];
                $init=clone $start;
                $key_interval='P0Y0M1DT0H0M0S';
                $start->add(new DateInterval($interval_string));

                while($init<$start){

                    $key="0.00000000 ".$init->format('U');
                    array_push($docs, $data[$key]);
                    $init->add(new DateInterval($key_interval));
                }

                foreach ($docs as $doc) {
                    $last_doc=$doc;
                    if($point_start===NULL){
                        for($i=0;$i<24;$i++){//serching from start
                            $hour_data=$doc["data"][$i];
                            if($hour_data!==NULL){

                                for($j=0;$j<60;$j++){ ///point at the start......
                                    $temp_point=$hour_data[$j];
                                    if($temp_point!==NULL){
                                        $point_start=$temp_point;
                                        break;
                                    }
                                }

                            }
                            if($point_start!==NULL){
                                break;
                            }
                        }
                    }
                }
                if($last_doc!==NULL){
                    for($i=23;$i>=0;$i--){//serching from start
                        $hour_data=$last_doc["data"][$i];
                        if($hour_data!==NULL){
                            for($j=59;$j>=0;$j--){ ///point at the start......
                                $temp_point=$hour_data[$j];
                                if($temp_point!==NULL){
                                    $point_end=$temp_point;
                                    break;
                                }
                            }

                        }
                        if($point_end!==NULL){
                            break;
                        }
                    }
                }
                $day=$start->format('Y-m-d');//result on this hour
                $data_point=($point_end-$point_start)*$prefix;
                $results[0][$data_count]=$day;
                $results[1][$data_count++]=$data_point;
            }
            return $results;
        }
 
    }

    function getLineChartDataOnDevice($mongo_db,$deviceID,$channelID_with_prefix,$xAxis,$startDate,$endDate,$sample_average_Rate){

        $sample_average_Rate=intval($sample_average_Rate);
        $pieces = explode("*", $channelID_with_prefix);
        $channelID=$pieces[1];
        $prefix=floatval($pieces[0]);
        $collection=$mongo_db->selectCollection($channelID);
        $accInt= strtolower($accInt);
        $data_count=0;

        $itr_time_real=new DateTime($startDate,new DateTimeZone("UTC"));
        $date_time=explode(" ",$startDate);
        $time=explode(":",$date_time[1]);
        $time_hours=intval($time[0]);
        $time_mins=intval($time[1]);

        $start = new DateTime($date_time[0],new DateTimeZone("UTC"));// "YYYY-MM-DD HH:MM:SS"
        $start_backup=clone $start;
        $end = new DateTime($endDate,new DateTimeZone("UTC"));

        $start_mongo=new MongoDate($itr_time_real->format('U'));
        $end_mongo=new MongoDate($end->format('U'));
        $cursor = $collection->find(array("_id" => array('$gte' => $start_mongo, '$lt' => $end_mongo)));
        $data=iterator_to_array($cursor);//data buffer

        
        $key="0.00000000 ".$start->format('U');
        $doc=$data[$key];
        $doc_old=$doc;
        if ($doc!==NULL) {
            $doc_old=$doc;
            $start_point_array=$doc["data"][$time_hours];
            if($start_point_array!==NULL){
                $st=$time_mins-5;
                $sum=0;
                $count=0;
                if($st<0)
                    $st=0;
                for($i=$st;$i<$st+10;$i++){
                    $pnt=$start_point_array[$i];
                    if($pnt!==NULL)
                       { $sum+=$pnt;
                         $count++;
                       }
                }
                if($count!==0){
                $results[0][$data_count]=$start->format("Y-m-d")." ".strval($time_hours).":".strval($time_mins).":00";
                $results[1][$data_count++]=$sum*$prefix/$count;
                }
            }
        }

        $interval_string='P0Y0M0DT0H'.strval($sample_average_Rate).'M0S';
        while($itr_time_real<$end){

            $itr_time_real->add(new DateInterval($interval_string));
            $date_time=explode(" ",$itr_time_real->format("Y-m-d H:i:s"));
            $time=explode(":",$date_time[1]);
            $time_hours=intval($time[0]);
            $time_mins=intval($time[1]);

            $start = new DateTime($date_time[0],new DateTimeZone("UTC"));// "YYYY-MM-DD HH:MM:SS"
            if($start!==$start_backup){

                $key="0.00000000 ".$start->format('U');
                $doc=$data[$key];
                $start_backup=clone $start;
                $doc_old=$doc;
                if ($doc!==NULL) {
                    $start_point_array=$doc["data"][$time_hours];
                    if($start_point_array!==NULL){
                        $st=$time_mins-5;
                        $sum=0;
                        $count=0;
                        if($st<0)
                            $st=0;
                        for($i=$st;$i<$st+10;$i++){
                            $pnt=$start_point_array[$i];
                            if($pnt!==NULL)
                            { $sum+=$pnt;
                                $count++;
                            }
                        }
                        if($count!==0)
                        {   $results[0][$data_count]=$start->format("Y-m-d")." ".strval($time_hours).":".strval($time_mins).":00";
                            $results[1][$data_count++]=$sum*$prefix/$count;
                        }
                    }
                }
            }
            else if($doc_old!==NULL){
                $start_point_array=$doc_old["data"][$time_hours];
                if($start_point_array!==NULL){
                    $st=$time_mins-5;
                    $sum=0;
                    $count=0;
                    if($st<0)
                        $st=0;
                    for($i=$st;$i<$st+10;$i++){
                        $pnt=$start_point_array[$i];
                        if($pnt!==NULL)
                        { $sum+=$pnt;
                            $count++;
                        }
                    }
                    if($count!==0)
                    {   $results[0][$data_count]=$start->format("Y-m-d")." ".strval($time_hours).":".strval($time_mins).":00";
                        $results[1][$data_count++]=$sum*$prefix/$count;
                    }
                }
            }

        }
        return $results;

    }
///////////Unit test on get line chart data////////////////////////////////////////////
/*$deviceID="Mtest";
$channelID_with_prefix='1*humidity';
$xAxis='date_time';
$startDate='2016-02-20';
$endDate='2018-02-24';
$sample_average_Rate=47;
$conn=new MongoClient("mongodb://development.enetlk.com:27017");
$mongo_db=$conn->selectDB($deviceID);
$date1 = new DateTime("now");
var_dump( getLineChartDataOnDevice($mongo_db,$deviceID,$channelID_with_prefix,$xAxis,$startDate,$endDate,$sample_average_Rate));
$date2 = new DateTime("now");
$dteDiff  = $date1->diff($date2); 
echo $dteDiff->format("%H:%I:%S"); */
?>