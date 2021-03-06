var colChart;

// This function renders a line chart:something vs date
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function initBarChart(chartID, title, chartData, axisX) {
    //var themeId = document.getElementById("themeCombo");
    var backgroundColor, fontColor, theme;
    if (globalTheme == "dark") {
        backgroundColor = "#2A2A2A";
        theme = "theme2";
        fontColor = "lightgray";
    } else if (globalTheme == "light") {
        backgroundColor = "white";
        theme = "theme1";
        fontColor = "#0d1a26";
    }
    var subtitle = "";
    // var dp = {};
    // if (chartData[0]) dp = chartData[0].dataPoints;
    // if (!(dp.length > 0)){
    //     addNote("Data error");
    //     return;
    // }
    
    var i = 0;
    var dp = chartData[0].dataPoints;
    while (dp.length == 0 && i < chartData.length - 1) {
        i++;
        dp = chartData[i].dataPoints;
    }

    if (i == chartData.length - 1){
        addNote("Data error");
        return;
    }    
        
    var start = formatDate(dp[0].x);
    var end = formatDate(dp[dp.length - 1].x);
    if (end==start) subtitle = end;
    else subtitle = start + ' to ' + end;

    if(chartData.length==1){
        chartData[0].color="#07c687";
    }

    var colChart = new CanvasJS.Chart(chartID,
        {
            theme: theme,
            backgroundColor: backgroundColor,
            animationEnabled: true,
            title:{
                text: title,
                fontColor: fontColor,
                fontStyle: "normal",
                fontWeight: "lighter",
                fontFamily: "Share Tech Mono",
                fontSize: 24
            },
            subtitles:[
                {
                    text: subtitle,
                    fontColor: fontColor,
                    fontStyle: "normal",
                    fontWeight: "lighter",
                    fontFamily: "candara",
                    fontSize: 14
                }
            ],
            toolTip: {
                shared: true
            },
            axisY: {
                //title: "Energy"
            }, 
            axisX:axisX,
            data: chartData,

          legend:{
            cursor:"pointer",
            fontColor: fontColor,
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
function loadBarChartData(chartID, title, equationList, xAxis, startDate, endDate, interval, tarrifs,type) {
    graphs[chartID] = {};
    var cData = {
        title: title,
        equationList: equationList,
        xAxis: xAxis,
        startDate: startDate,
        endDate: endDate,
        interval: interval,
        tarrifs: tarrifs,
        type: type
    };

    graphs[chartID]["chartData"] = cData;

// Get accInt from interval
    var accInt = "DAY";
    if(interval == "day"){
        accInt = "HOUR";
    }else if (interval == "week"){
        accInt = "DAY";
    }else if(interval == "month"){
        accInt = "DAY";
    }else if(interval == "year"){
        accInt = "MONTH";
    }

    //Get devices channels and units from equationList
    var devices = [];
    var channels = [];
    var units = [];
    for(i = 0; i < equationList.length; i++){
        for(j = 0; j < equationList[i]['equation'].length; j++){
            var expression = equationList[i]['equation'][j];
            devices.push(expression.device);
            channels.push(expression.number + expression.op + expression.channel);
            units.push(expression.unit);
        }
    }

    $.ajax({
        url: "back/load_data.php",
        method: "POST",
        data: {devices: devices, channels: channels, xAxis: xAxis, startDate: startDate, endDate: endDate, accInt: accInt, tarrifs: tarrifs, type: type},
        dataType: "json",
        success: function(data, status) {
            console.log("Bar chart load data: " + status);
            var chartData = [];
            var channelCounter = 0;

            var dateTimeFormat = "hh:mmTT D\’th\’ MMM YY";
            var intervalType = "minute";
            if(accInt == "HOUR"){
                dateTimeFormat = "hhTT";
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
                initBarChart(chartID, "No Data...", chartData, axisX);
                $(".filter-button").removeAttr("disabled");
                return "No data";
            }
            
            if (type=="column") {
                for(i = 0; i < equationList.length; i++) {
                    var equation = equationList[i]['equation'];
                    var eqName = equationList[i]['eqName'];
                    var equationData = [];
                    for(j = 0; j < equation.length; j++){
                        var expression = equation[j];
                        var channel = expression.number + expression.op + expression.channel;
                        var device = expression.device;
                        if(data[device] == null){
                            continue;
                        }else{
                            if (!data[device][xAxis]) continue;
                            else channelCounter++;
                        }
                        var _len = data[device][xAxis].length;
                        for(k = 0; k < _len ; k++){
                            if(j == 0){
                                equationData[k] = 0;
                            }
                            equationData[k] += data[device][channel][k];
                        }
                    }
                    // window.alert(device);
                    // if (!data[device]) window.alert("null");
                    


                    var column={
                        name: eqName,
                        type: "column", showInLegend: true,
                        yValueFormatString:"#.## "+equation[equation.length-1].unit,
                    };
                    var dataPoints = [];

                    //var _len = data[device][xAxis].length;
                    for(j = 0; j < _len ; j++){
                        dataPoints.push({
                            x: new Date(data[device][xAxis][j]),
                            y: equationData[j]
                        });
                    }

                    column.dataPoints = dataPoints;
                    chartData.push(column);
                }
            } else if (type=="stackedColumn") {

            // if(data == null){
            //     initBarChart(chartID,"No Data...",chartData,axisX);
            //     $(".filter-button").removeAttr("disabled");
            //     return "No data";
            // }

                for (key in data) {
                    var deviceData = data[key];
                
                    for(i = 0; i < equationList.length; i++){
                        var equation = equationList[i]['equation'];
                        var eqName = equationList[i]['eqName'];
                        var equationData = [];
                        for(j = 0; j < equation.length; j++){
                            var expression = equation[j];
                            var channel = expression.number + expression.op + expression.channel;
                            var device = expression.device;
                            if(deviceData[device] == null){
                                continue;
                            }else{
                                if (!deviceData[device][xAxis]) continue;
                                else channelCounter++;
                            }
                            var _len = deviceData[device][xAxis].length;
                            for(k = 0; k < _len ; k++){
                                if(j == 0){
                                    equationData[k] = 0;
                                }
                                equationData[k] += deviceData[device][channel][k];
                            }
                        }
                        // window.alert(device);
                        // if (!deviceData[device]) window.alert("null");
                        


                        var column={
                            name: key,
                            type: "stackedColumn", showInLegend: true,
                            toolTipContent: "{label}<br/><span style='\"'color: {color};'\"'><strong>{name}</strong></span>: {y}".unit,
                            yValueFormatString:"#.## "+equation[equation.length-1].unit,
                        };
                        var dataPoints = [];

                        //var _len = deviceData[device][xAxis].length;
                        if (!deviceData[device]) continue;
                        for(j = 0; j < _len ; j++){
                            dataPoints.push({
                                x: new Date(deviceData[device][xAxis][j]),
                                y: equationData[j]
                            });
                        }

                        column.dataPoints = dataPoints;
                        chartData.push(column);
                    }
                }    
            }
            
/////////////////////////////

            if(channelCounter == 0){
                initBarChart(chartID, "No Data...", chartData, axisX);
            }else{
                initBarChart(chartID, title, chartData, axisX);
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
