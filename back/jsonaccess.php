<?php

	$userdataFile = "../data/userdata.json";
	$json_directory = "../data/";
	function writeEquations($userID,$eqList){
		global $json_directory;
		$userdataFile=$json_directory."".$userID.".json";
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		$userdata["EqList"] = $eqList;
		file_put_contents($userdataFile, json_encode($userdata,TRUE));
		return True;
	}

	function getEquations($userID){
		global $json_directory;
		$userdataFile=$json_directory."".$userID.".json";
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		if(isset($userdata)){
			if(isset($userdata["EqList"])){
				return $userdata["EqList"];
			} 
		}
		return [];
	}

	function saveGrid($userID,$grid, $theme){
		global $json_directory;
		$userdataFile=$json_directory."".$userID.".json";
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		$userdata["Grid"] = $grid;
	 	$userdata["Theme"] = $theme;
		file_put_contents($userdataFile, json_encode($userdata,TRUE));
		return True;	
	}

	function loadGrid($userID){
		global $json_directory;
		$userdataFile=$json_directory."".$userID.".json";
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		if(isset($userdata)){
			if(isset($userdata["Grid"])){
				return $userdata["Grid"];
			}
			 
		}
		return [];
		
	}

	function writeAlerts($userID,$alertData){
		global $json_directory;
		$userdataFile=$json_directory."".$userID.".json";
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		$userdata["Alerts"] = $alertData;
		file_put_contents($userdataFile, json_encode($userdata,TRUE));
		return True;
	}

	function getAlerts($userID){
		global $json_directory;
		$userdataFile=$json_directory."".$userID.".json";
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		if(isset($userdata)){
			if(isset($userdata["Alerts"])){
				return $userdata["Alerts"];
			} 
		}
		return [];
	}

	function loadTheme($userID){
		global $json_directory;
		$userdataFile=$json_directory."".$userID.".json";
		$default = "light";
		try {
			$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		}catch (Exception $e) {
			echo $e;
		}
		if(isset($userdata)){
			if(isset($userdata["Theme"])){
				return $userdata["Theme"];
			}			 
		}
		return $default;		
	}

?>