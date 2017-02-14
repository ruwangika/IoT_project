var pieChart;

function loadPieChartData(chartID,title,equationList,total,startDate,endDate,dataType,type){
    graphs[chartID] = {};
    var cData = {
        title: title,
        equationList: equationList,
        total: total,
        startDate: startDate,
        endDate: endDate,
        dataType: dataType,
        type: type
    };
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

    graphs[chartID]["chartData"] = cData;
    if(total != -1){
        if (devices.indexOf(total) < 0) {
            devices.push(total);
        }
    }
    $.ajax({
        url: "back/load_data.php",
        method: "POST",
        data: {devices: devices, channel: channels[0], startDate: startDate, endDate: endDate, dataType: dataType, type: type},
        dataType: "json",
        success: function(data, status) {
            console.log("Pie chart load data: " + status);
            var chartData = [];
            var channelCounter = 0;
            var d_len = devices.length;
            if(total != -1){
                var sum = 0;
                for(i = 0; i < d_len-1; i++){
                    sum += data[devices[i]][channel];
                }       
                var other_val = data[devices[d_len-1]][channel] - sum;
                data[devices[d_len-1]][channel] = (Math.round(other_val*10))/10;
                data[devices[d_len-1]]["DeviceName"] = "Other";
            }
            for(i = 0; i < d_len; i++){
                var value = (Math.round(data[devices[i]][channel]*10))/10;
                var deviceName = data[devices[i]]["DeviceName"] + " : " + value;
                var legend = data[devices[i]]["DeviceName"];
                var dataPoints = { y: value, legendText: legend, indexLabel: legend+": #percent%" };
                chartData.push(dataPoints);
            }
            
            initPieChart(chartID,title,chartData,units[0]);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log(XMLHttpRequest);
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
             $("#"+chartID).html(title+"No data");
             $(".filter-button").removeAttr("disabled");
            return "No data";
        }    
    });
}

function initPieChart(chartID,title,chartData,unit){
    var pieChart = new CanvasJS.Chart(chartID, {
        theme: "theme1",
        animationEnabled: false,
        backgroundColor: "white",
        title: {
            text: title,
            fontColor: "#0d1a26",
            fontStyle: "normal",
            fontWeight: "lighter",
            fontFamily: "calibri",
            fontSize: 24
        },
        legend: {
            verticalAlign: "bottom",
            horizontalAlign: "center",
            fontColor: "#0d1a26"
        },
        data: [{
            type: "pie",
            showInLegend: true,
            toolTipContent: "{y} - #percent %",
            yValueFormatString: "#,###.## "+unit,
            dataPoints: chartData
        }]
    });

    pieChart.render();
    graphs[chartID]["chart"] = pieChart;
    graphs[chartID]["type"] = "pieChart";
    $(".filter-button").removeAttr("disabled");
}