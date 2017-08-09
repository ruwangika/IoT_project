
<?php
 
    require 'dbaccess.php';
    $field = $_POST["field"];
    if($field == "devices_ePro1000"){
    	//echo json_encode($obj);
    	//echo json_encode({"aa":"aa"});
        $user_id=$_POST["user_id"];
    	$data = getEproDeviceList($user_id);
    	echo json_encode($data);

    }
    elseif($field=="devices_Custom"){//load on equation panel board----------------------------------------------------
        $user_id=$_POST["user_id"];
        $data = getCustomDeviceList($user_id);
    	echo json_encode($data);
    }
    elseif($field=="device_Register"){// register new device
        $user_id=$_POST["user_id"];
        $user_device_id=$_POST["user_device_id"];
        $key=generateRandomString(10);
        $device_id="M".$key;
        registerDevice($user_id,$user_device_id,$device_id);
        echo $key;

    }
    elseif($field=="device_Remove"){ // remove exsiting devices
        $psk=$_POST["psk"];
        $device_id='M'.$psk;
        $result=removeDevice($device_id);
        echo json_encode($result);

    }

    elseif($field=="device_CustomList"){// load on manage dashboard devices list------------------------------------------------------
        $user_id=$_POST["user_id"];
        $result=getCustomUserDeviceList($user_id);
        echo json_encode($result);
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
    // For help chat
    elseif ($field=="get_msg") {
        $chatMsg = $_POST["msg"];
        $replyMsg = getChatReply($chatMsg);

        //To log chat if needed

        // $chatLog = "../data/chatlog.html";
        // $file = fopen("log.html", 'a');
        // fwrite($file, $chatMsg . '\n');
        // fwrite($file, $replyMsg . '\n');
        // fclose($file);
        
        echo json_encode($replyMsg);
    }

    function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    function getChatReply($msg) {
        // To do        
        return "Sorry, we're still on testing stage.";
    }
?>