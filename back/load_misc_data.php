
<?php
    
    require 'dbaccess.php';

    
    $field = $_POST["field"];
    if($field == 'devices'){
    	
    	$data = getDeviceList();
    	echo json_encode($data);

    }else if($field == 'channels'){
    	
    	$data = getChannelList();
    	echo json_encode($data);
    
    }
?>