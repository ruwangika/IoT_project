<?php

	$userdataFile = "../data/userdata.json";

	function writeEquations($userID,$eqList,$eqNameList){
		global $userdataFile;
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		$userdata[$userID]["EqList"] = $eqList;
		$userdata[$userID]["EqNameList"] = $eqNameList;
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

	function getEquationNames($userID){
		global $userdataFile;
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		if(isset($userdata[$userID])){
			if(isset($userdata[$userID]["EqNameList"])){
				return $userdata[$userID]["EqNameList"];
			} 
		}
		return [];
	}

	function saveGrid($userID,$grid, $theme){
		global $userdataFile;
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		$userdata[$userID]["Grid"] = $grid;
	 	$userdata[$userID]["Theme"] = $theme;
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

	function loadTheme($userID){
		global $userdataFile;
		$default = "light";
		$userdata = json_decode(file_get_contents($userdataFile),TRUE);
		if(isset($userdata[$userID])){
			if(isset($userdata[$userID]["Theme"])){
				return $userdata[$userID]["Theme"];
			}			 
		}
		return $default;		
	}

?>