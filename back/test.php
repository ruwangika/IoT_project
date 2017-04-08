<?php
    
       $con=mysqli_connect("localhost","dileep","dileep@123","c_epro_5000_test"); //connection string
		if ($con->connect_error) {
	    	die("Connection failed: " . $con->connect_error);
		}
        $query="insert into powerpro(record_no,sdCounter,code,date_time,ph1_active_energy,ph2_active_energy,ph3_active_energy,ph1_reactive_energy,ph2_reactive_energy,ph3_reactive_energy,ph1_apperant_energy,ph2_apperant_energy,ph3_apperant_energy,ph1_active_power,ph2_active_power,ph3_active_power,ph1_reactive_power,ph2_reactive_power,ph3_reactive_power,ph1_apperant_power,ph2_apperant_power,ph3_apperant_power,ph1_current,ph2_current,ph3_current,ph1_volt,ph2_volt,ph3_volt,ph1_frequency,ph2_frequency,ph3_frequency,ph1_pf,ph2_pf,ph3_pf,sender_ip,rcv_time,Dvc_Sts,Sgnl_strn) values ";
        //To execute query

        $handle = fopen ( '2088.csv', 'r' );
        while ( $row = fgetcsv ( $handle ) ) {
                $row[34]="'".$row[34]."'";
                $row[2]="1095";
                $data = implode ( ",", $row );
                $str=$query."(".$data.")";
                $results=mysqli_query($con,$str);
        }
        $handle = fopen ( '2089.csv', 'r' );
        while ( $row = fgetcsv ( $handle ) ) {
                $row[34]="'".$row[34]."'";
                $row[2]="1082";
                $data = implode ( ",", $row );
                $str=$query."(".$data.")";
                $results=mysqli_query($con,$str);
        }
        closeConnection($con);


    
?>