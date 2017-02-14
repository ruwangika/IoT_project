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

function getStartDate(days){
    var date = new Date();
    var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    var day =last.getDate();
    if (day < 10) {
        day = '0' + day
    }
    var month=last.getMonth()+1;
    if (month < 10) {
        month = '0' + month
    }
    var year=last.getFullYear();
    return year + '-' + month + '-' + day;
}

// This function renders a line chart:something vs date
function initLineChart(chartID,title, chartData) {
    lineChart = new CanvasJS.Chart(chartID, {
        zoomEnabled: true,
        backgroundColor: "white",
        theme: "theme1",
        title: {
            text: title,
            fontColor: "#0d1a26",
            fontStyle: "normal",
            fontWeight: "lighter",
            fontFamily: "calibri",
            fontSize: 24
        },
        legend: {
            cursor: "pointer",
            fontColor: "#0d1a26",
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
    graphs[chartID]["chart"] = lineChart;
    graphs[chartID]["type"] = "lineChart";
    $(".filter-button").removeAttr("disabled");

}

// This function updates the chart according to the provided data
function updatelineChartData(chart,chartData) {
    chart.options.data = chartData;
    chart.render();
}

// This function will return the data array when parameters are provided
function loadlineChartData(chartID,title,equationList, xAxis, startDate, endDate, interval,type) {
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
        data: {devices: devices, channels: channels, xAxis: xAxis, startDate: startDate, endDate: endDate, interval: interval, type: type},
        dataType: "json",
        success: function(data, status) {
            console.log("Line chart load data: " + status);
            var chartData = [];
            var channelCounter = 0;
            for(i = 0; i < devices.length; i++){
                var channel = channels[i];
                var device = devices[i];
                var unit = units[i];
                //console.log(Math.max(data[device][channel]));
                
                var dataPoints = [];
                if(data[device][xAxis] == null){
                    continue;
                }else{
                    channelCounter++;
                }
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
                    type: "line", showInLegend: true,
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