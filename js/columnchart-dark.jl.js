var colChart;

// This function renders a line chart:something vs date
function initBarChart(chartID,title, chartData,axisX) {

    var colChart = new CanvasJS.Chart(chartID,
        {
            theme: "theme3",
            backgroundColor: "#2A2A2A",
            animationEnabled: true,
            title:{
                text: title,
                fontColor: "lightgray",
                fontStyle: "normal",
                fontWeight: "lighter",
                fontFamily: "calibri",
                fontSize: 24
            },
            toolTip: {
                shared: true
            },          
            axisY: {
                title: "Energy"
            }, axisX:axisX,
            data: chartData,
          legend:{
            cursor:"pointer",
            fontColor: "lightgray",
            itemclick: function(e){
              if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
              }
              else {
                e.dataSeries.visible = true;
              }
                colChart.render();
            }
          },
        });

    colChart.render();
    graphs[chartID]["chart"] = colChart;
    graphs[chartID]["type"] = "colChart";
    $(".filter-button").removeAttr("disabled");
}

// This function updates the chart according to the provided data
function updateBarChartData(chartData) {
    colChart.options.data = chartData;
    colChart.render();
}

// This function will return the data array when parameters are provided
function loadBarChartData(chartID,title,equationList, xAxis, startDate, endDate, accInt,tarrifs,type) {
    graphs[chartID] = {};
    var cData = {
        title: title,
        equationList: equationList,
        xAxis: xAxis,
        startDate: startDate,
        endDate: endDate,
        accInt: accInt,
        tarrifs: tarrifs,
        type: type
    };
    
    graphs[chartID]["chartData"] = cData;

    //Get devices channels and units from equationList
    var devices = [];
    var channels = [];
    var units = [];
    for(i = 0; i < equationList.length; i++){
        for(j = 0; j < equationList[i].length; j++){
            var expression = equationList[i][j];
            devices.push(expression.device);
            channels.push(expression.number + expression.op + expression.channel);
            units.push(expression.unit);
        }
    }

    $.ajax({
        url: "back/load_data.php",
        method: "POST",
        data: {devices: devices, channels: channels, xAxis: xAxis, startDate: startDate, endDate: endDate, accInt: accInt,tarrifs: tarrifs, type: type},
        dataType: "json",
        success: function(data, status) {
            console.log("Bar chart load data: " + status);
            var chartData = [];
            var channelCounter = 0;

            var dateTimeFormat = "hh:mmTT D\’th\’ MMM YY";
            var intervalType = "minute";
            if(accInt == "HOUR"){
                dateTimeFormat = "hhTT D\’th\’";
                intervalType = "hour";
            }else if(accInt == "DAY"){
                dateTimeFormat = "DDD D";
                intervalType = "day";
            }else if(accInt == "WEEK"){
                dateTimeFormat = "D MMM YY";
                intervalType = "week";
            }else if(accInt == "MONTH"){
                dateTimeFormat = "MMM YYYY";
                intervalType = "month";
            }else if(accInt == "YEAR"){
                dateTimeFormat = "YYYY";
                intervalType = "year";
            }

            var axisX = {   
                valueFormatString: dateTimeFormat,
                interval: 1, 
                intervalType: intervalType,
                labelAngle: -30,
                labelFontSize: 13,
            }
            if(data == null){
                initBarChart(chartID,"No Data...",chartData,axisX);
                $(".filter-button").removeAttr("disabled");
                return "No data";
            }


            for(i = 0; i < equationList.length; i++){
                var equation = equationList[i];
                var equationData = [];
                for(j = 0; j < equation.length; j++){
                    var expression = equation[j];
                    var channel = expression.number + expression.op + expression.channel;
                    var device = expression.device;
                    if(data[device] == null){
                        continue;
                    }else{
                        channelCounter++;
                    }
                    var _len = data[device][xAxis].length;
                    for(k = 0; k < _len ; k++){
                        if(j == 0){
                            equationData[k] = 0;
                        }
                        equationData[k] += data[device][channel][k];
                        
                    }
                    

                }
                
                var column={
                    name: parseEquation(equation),
                    type: "column", showInLegend: true,
                    yValueFormatString:"#.## "+equation[equation.length-1].unit,
                };
                var dataPoints = [];
                
                var _len = data[device][xAxis].length;
                for(j = 0; j < _len ; j++){
                    dataPoints.push({
                        x: new Date(data[device][xAxis][j]),
                        y: equationData[j]
                    });
                }
                
                column.dataPoints = dataPoints;
                chartData.push(column);
            }  
            if(channelCounter == 0){
                initBarChart(chartID,"No Data...",chartData,axisX);
            }else{
                initBarChart(chartID,title,chartData,axisX);   
            }
            return chartData;  
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log(XMLHttpRequest);
            $("#"+chartID).html(title+" : No data");
            $(".filter-button").removeAttr("disabled");
            return "No data";
        }    
      });
}