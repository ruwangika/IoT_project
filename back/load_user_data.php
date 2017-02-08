<?php
	require 'userdbaccess.php';

	$field = $_POST["field"];
	if($field == 'users'){
        
        $data = getUserList();
        echo json_encode($data);
    
    }
?>