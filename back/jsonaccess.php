<?php

	$userdataFile = "../data/userdata.json";

	function writeEquations($userID,$eqList){
		global $userdataFile;
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		$userdata[$userID]["EqList"] = $eqList;
		file_put_contents($userdataFile, json_encode($userdata,TRUE));
		return True;
	}

	function getEquations($userID){
		global $userdataFile;
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		if(isset($userdata[$userID])){
			if(isset($userdata[$userID]["EqList"])){
				return $userdata[$userID]["EqList"];
			} 
		}
		return [];
	}

	function saveGrid($userID,$grid){
		global $userdataFile;
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		$userdata[$userID]["Grid"] = $grid;
		file_put_contents($userdataFile, json_encode($userdata,TRUE));
		return True;	
	}

	function loadGrid($userID){
		global $userdataFile;
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		if(isset($userdata[$userID])){
			if(isset($userdata[$userID]["Grid"])){
				return $userdata[$userID]["Grid"];
			}
			 
		}
		return [];
		
	}

?>