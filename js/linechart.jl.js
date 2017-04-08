var lineChart;

function todayDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var today = yyyy + '-' + mm + '-' + dd;
    return today;
}

function todayTime() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var hour = today.getHours();
    var mins = today.getMinutes();

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var today = yyyy + '-' + mm + '-' + dd + ' ' + hour + ':'+mins;
    return today;
}

// This function renders a line chart:something vs date
function initLineChart(chartID,title, chartData) {
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
    var dp = chartData[0].dataPoints;
    var start = formatDate(dp[0].x);
    var end = formatDate(dp[dp.length - 1].x);
    if (end==start) subtitle = end;
    else subtitle = start + ' to ' + end;

    lineChart = new CanvasJS.Chart(chartID, {
        zoomEnabled: true,
        backgroundColor: backgroundColor,
        theme: theme,
        title: {
            text: title,
            fontColor: fontColor,
            fontStyle: "normal",
            fontWeight: "lighter",
            fontFamily: "calibri",
            fontSize: 24
        },
        subtitles:[
            {
                text: subtitle,
                fontColor: fontColor,
                fontStyle: "normal",
                fontWeight: "lighter",
                fontFamily: "calibri",
                fontSize: 14
            }
		],
        legend: {
            cursor: "pointer",
            fontColor: fontColor,
            itemclick: function(e) {
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }
        },
        axisY: {
            includeZero: false
        },
        data: chartData,
    });
    lineChart.render();
    //$("#divLoading").hide();
    graphs[chartID]["chart"] = lineChart;
    graphs[chartID]["type"] = "lineChart";
    $(".filter-button").removeAttr("disabled");

}

// This function updates the chart according to the provided data
function updatelineChartData(chart, chartData) {
    chart.options.data = chartData;
    chart.render();
}

//Find the min xAxis length of devices in an equation
function getMinLength(equation, data, xAxis) { 
    var len = Number.POSITIVE_INFINITY;
    for(j = 0; j < equation.length; j++){
        var device = equation[j].device;
        if (data[device][xAxis]) {
            if (data[device][xAxis].length < len)
            len = data[device][xAxis].length;
        }
        else continue;       
    }
    return len;
}

// This function will return the data array when parameters are provided
function loadlineChartData(chartID, title, equationList, xAxis, startDate, endDate, interval, type) {
    graphs[chartID] = {};
    var cData = {
        title: title,
        equationList: equationList,
        xAxis: xAxis,
        startDate: startDate,
        endDate: endDate,
        interval: interval,
        type: type
    };

    graphs[chartID]["chartData"] = cData;

    //Get devices channels and units from equationList
    var devices = [];
    var channels = [];
    var units = [];
    for(i = 0; i < equationList.length; i++){//ith equation
        for(j = 0; j < equationList[i].length; j++){
            var expression = equationList[i][j];//
            devices.push(expression.device);
            channels.push(expression.number + expression.op + expression.channel);
            units.push(expression.unit);
        }
    }

    $.ajax({
        url: "back/load_data.php",
        method: "POST",
        data: {devices: devices, channels: channels, xAxis: xAxis, startDate: startDate, endDate: endDate, interval: interval, type: type},
        dataType: "json",
        success: function(data, status) {
            console.log("Line chart load data: " + status);
            var chartData = [];
            var channelCounter = 0;
            for(i = 0; i < equationList.length; i++) {
                _len = getMinLength(equationList[i], data, xAxis);   
                var sum = 0;
                var min = Number.POSITIVE_INFINITY;
                var max = Number.NEGATIVE_INFINITY;
                var dataPoints = [];
                var unit;
                if (_len == null || _len == Number.POSITIVE_INFINITY)
                    continue;
                channelCounter++;
                for(count=0;count<_len;count++){
                   var p_x=0;
                   var p_y=0;
                   for(j = 0; j < equationList[i].length; j++) {
                        var expression = equationList[i][j];
                        var device = expression.device;
                        var channel = expression.number + expression.op + expression.channel;
                        if (!data[device][xAxis]) continue;
                        t_unit = expression.unit;
                        if(t_unit!=null)
                            unit=t_unit;
                        p_x = new Date(data[device][xAxis][count]);
                        p_y += data[device][channel][count];
                   }
                   sum+=p_y;
                   if(min>p_y)
                       min=p_y;
                   if(max<p_y)
                      max=p_y;
                    dataPoints.push({
                            x: p_x,
                            y: p_y
                    });
                }
                var avg = Math.round(sum/_len * 100) / 100;
                min = Math.round(min * 10) / 10;
                max = Math.round(max * 10) / 10;
                var line={
                    name: parseEquation(equationList[i])+', avg='+avg+', max='+max+', min='+min,
                    type: "line",
                    showInLegend: true,
                    yValueFormatString:"#.## "+unit,
                    connectNullData:true,
                    nullDataLineDashType:"dot"
                };
                line.dataPoints = dataPoints;
                chartData.push(line);                    
                        
            }
            if(channelCounter == 0){
                return initLineChart(chartID,"No Data..",chartData);    
            } 
            return initLineChart(chartID,title,chartData);               
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log(XMLHttpRequest);
            $("#"+chartID).html(title+" : No Data..");
            $(".filter-button").removeAttr("disabled");
            return "No data";
        }    
    });
}

/*
function updateLineChart(chartID,title,devices, channels, xAxis, startDate, endDate, interval,type) {
    graphs[chartID] = {};
    var cData = {
        title: title,
        devices: devices,
        channels: channels,
        xAxis: xAxis,
        startDate: startDate,
        endDate: endDate,
        interval: interval,
        type: type
    };

    graphs[chartID]["chartData"] = cData;
    console.log(cData);
    $.ajax({
        url: "back/load_data.php",
        method: "POST",
        data: {devices: devices, channels: channels, xAxis: xAxis, startDate: startDate, endDate: endDate, interval: interval, type: type},
        dataType: "json",
        success: function(data, status) {
            console.log("Load data to php: " + status);
            var chartData = [];
            for(i = 0; i < devices.length; i++){
                var channel = channels[i];
                var device = devices[i];
                //console.log(Math.max(data[device][channel]));
                
                var dataPoints = [];
                var _len = data[device][xAxis].length;
                var sum = 0;
                var min = data[device][channel][0];
                var max = data[device][channel][0];
                for(j = 0; j < _len ; j++){
                    var x = new Date(data[device][xAxis][j]);
                    var y = data[device][channel][j];
                    
                    dataPoints.push({
                        x: x,
                        y: y
                    });

                    sum += y;
                    if(min > y){
                        min = y;
                    }if(max < y){
                        max = y;
                    }
                }
                var avg = Math.round(sum/_len * 100) / 100;
                min = Math.round(min * 10) / 10;
                max = Math.round(max * 10) / 10;
                var line={
                    name: device+':'+channel+', avg='+avg+', max='+max+', min='+min,
                    type: "line", showInLegend: true
                };
                line.dataPoints = dataPoints;
                chartData.push(line);
            }  
            return updatelineChartData(graphs[chartID]["chart"],chartData);             
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log(XMLHttpRequest);
            return null;
        }    
    });
}
*/