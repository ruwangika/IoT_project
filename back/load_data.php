
<?php
    
    require 'dbaccess.php';
    $type = $_POST["type"];
    if($type == 'line'){
    	
    	$codes = $_POST["devices"];
	    $yAxes = $_POST["channels"];
	    $xAxis = $_POST["xAxis"];
	    $startDate = $_POST["startDate"];
	    $endDate = $_POST["endDate"];
    	$interval = $_POST["interval"];
    	$data = getLineChartData($codes,$yAxes,$xAxis,$startDate,$endDate,$interval);
    	echo json_encode($data);

    }else if($type == 'column'){
    	
    	$codes = $_POST["devices"];
	    $yAxes = $_POST["channels"];
	    $xAxis = $_POST["xAxis"];
	    $startDate = $_POST["startDate"];
	    $endDate = $_POST["endDate"];
    	$accInt = $_POST["accInt"];
    	$tarrifs = $_POST["tarrifs"];
    	$data = getBarChartData($codes,$yAxes,$xAxis,$startDate,$endDate,$accInt,$tarrifs);
    	echo json_encode($data);
    
    }else if($type == 'pie'){

    	$devices = $_POST["devices"];
    	$channel = $_POST["channel"];
        $startDate = $_POST["startDate"];
        $endDate = $_POST["endDate"];
        $dataType = $_POST["dataType"];
    	$data = getPieChartData($devices,$channel,$startDate,$endDate,$dataType);
    	echo json_encode($data);

    }
?>