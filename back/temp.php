<?php
       $start = new DateTime('2017-02-23',new DateTimeZone("UTC"));
      $interval_string='P0Y0M1DT0H0M0S';
      $start_mongo=new MongoDate($start->format('U'));
      $start->add(new DateInterval($interval_string));
       $end_mongo=new MongoDate($start->format('U'));
       $date1 = new DateTime("now");
       $conn=new MongoClient("mongodb://development.enetlk.com"); 
       $db=$conn->selectDB("Mtest");
       $collection=$db->selectCollection("humidity");
       $cursor = $collection->find();
       $cursor = $collection->find();
       $rest=iterator_to_array($cursor);
       $key=[1,2,15,4,5,6,7];
       foreach($key as $a){
         var_dump($a);
       }
       $date2 = new DateTime("now");
       $dteDiff  = $date1->diff($date2); 
       echo $dteDiff->format("%H:%I:%S"); 
      // $date=$date->add(new DateInterval($interval_string));
      // echo $date->format('Y-m-d H:i:s');
      /* $t=new MongoDate($date->format('U'));
       echo $t."\n";
       //$date=$t->toDateTime()->setTimezone(new DateTimeZone('Asia/Jayapura'));
       //echo $date->format('Y-m-d H:i:s');

       $pieces = explode(" ", "2000-01-01 00:00:00");
       
	   $db=$conn->selectDB("Mtest");
       $collection=$db->selectCollection("humidity");
      // $start_mongo=new MongoDate($start->format('U'));
       $cursor = $collection->find(array("_id"=>$t));
       foreach ($cursor as $doc) {
         $s="-1";
         $s=NULL;
         if($s!==NULL){
           echo "done";
         }
         echo $doc["data"][23][5]*$s;
       }
       echo "fuck";*/
?>
