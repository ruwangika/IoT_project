var pieChart;

function loadPieChartData(chartID,title,equationList,total_index,startDate,endDate,dataType,type){
    graphs[chartID] = {};
    var cData = {
        title: title,
        equationList: equationList,
        total_index: total_index,
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
   /* if(total_index != -1){
        if (devices.indexOf(total_index) < 0) {
            devices.push(total_index);
        }
    }*/
    $.ajax({
        url: "back/load_data.php",
        method: "POST",
        data: {devices: devices, channel: channels, startDate: startDate, endDate: endDate, dataType: dataType, type: type},
        dataType: "json",
        success: function(data, status) {
            console.log("Pie chart load data: " + status);
            var chartData = [];
            var channelCounter = 0;
            var d_len = devices.length;
//////////////////////////////////////////////////////////////////////////////////////////////////////

            if(data == null){
                initPieChart(chartID,"No Data...",chartData,units[0]);
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
                
                
                var dataPoint = { legendText: expression.eqName, indexLabel: expression.eqName+": #percent%" };
                
                var _len = data[device][xAxis].length;
                for(j = 0; j < _len ; j++){
                    dataPoint.y=equationData[j];
                }
                
                chartData.push(dataPoint);
            }  
            var sum=0;
            for(i=0;i<chartData.length;i++){
                if(i!=total_index)
                    sum+=chartData[i].y;
            }

            if (total_index!=-1){
                 var dataPoint = { legendText: "Other", indexLabel: "Other"+": #percent%" };
                 y=chartData[total_index].y;
                 rest=y-sum;
                 if(y>0){
                    chartData.splice(total_index, 1);
                    dataPoint.y=rest;
                    sum=y;
                    chartData.push(dataPoint);
                 }
                 else{
                    initPieChart(chartID,"Total is less than sum of others!",null,null);
                    return -1;
                 }
            }
            for(i=0;i<chartData.length;i++){
                chartData[i].y=Math.round(chartData[i].y*10000/sum)/100;
            }
            if(channelCounter == 0){
                initPieChart(chartID,title,chartData,units[0]);
            }else{
                initPieChart(chartID,"no data!",null,null); 
            }
/////////////////////////////////////////////////////////////////////////////////////////////////////



           /* if(total != -1){
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
            }*/
            
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
        theme: "theme2",
        animationEnabled: false,
        backgroundColor: "#2A2A2A",
        title: {
            text: title,
            fontColor: "lightgray",
            fontStyle: "normal",
            fontWeight: "lighter",
            fontFamily: "calibri",
            fontSize: 24
        },
        legend: {
            verticalAlign: "bottom",
            horizontalAlign: "center",
            fontColor: "lightgray"
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