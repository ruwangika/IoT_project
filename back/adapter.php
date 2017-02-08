
<?
class DataController{

	function lineChartData($deviceID,$channelIDs,$xAxis,$startDate,$endDate,$graphType='line' ,$accInt=1,$widgetSize=10){
		return getLineChartData ($code,$yAxes,$xAxis,$startDate,$endDate,'line',$interval,10);
	}

	function columnChartData($deviceID,$channelIDs,$xAxis,$startDate,$endDate,$accInt,$tarrifs	){
		return getColumnChartData($deviceID,$channelIDs,$xAxis,$startDate,$endDate,$accInt,$tarrifs	);
	}
	
}



?>