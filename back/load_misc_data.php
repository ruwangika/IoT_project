
<?php
 
    require 'dbaccess.php';
    $field = $_POST["field"];
    if($field == "devices_ePro1000"){
    	//echo json_encode($obj);
    	//echo json_encode({"aa":"aa"});
    	$data = getEproDeviceList();
    	echo json_encode($data);

    }
    elseif($field=="devices_Custom"){
        $data = getCustomDeviceList();
    	echo json_encode($data);
    }
    else if($field == "epro_channels"){
    	
    	$data = getEProChannelList();
    	echo json_encode($data);
    
    }
    elseif($field=="deviceTypes"){
        $data=getDeviceTypes();
        echo json_encode($data);
    }
    elseif($field=="custom_channels"){
        $id=$_POST["id"];
        $data=getCustomDeviceChennels($id);
        echo json_encode($data);
    }
?>